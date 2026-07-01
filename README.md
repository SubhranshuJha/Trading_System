# QuantEdge — Trading System

A full-stack stock trading platform with a real-time market UI, IPO marketplace, portfolio management, and a custom **Java order-matching engine**. The system supports user and company accounts, limit/market orders, ledger-based wallets, and crash recovery for the in-memory matching engine.

---

## Features

### For traders (users)
- Register / login with JWT auth
- Browse live market and stock details
- Place **BUY** and **SELL** orders (market & limit)
- Real-time stock price updates via Socket.IO
- Portfolio, wallet (deposit funds), orders, and trade history
- Apply for IPOs with bid locking and allocation

### For companies
- Separate company auth flow
- Create listed stocks
- Launch and manage IPOs
- View company dashboard and stock activity

### Platform capabilities
- **Double-entry style ledger** — deposits, locks, buys, sells, unlocks, refunds
- **Price-time priority matching** — handled by the Java engine
- **IPO cutoff & allocation** — demand-based pricing with share distribution
- **Realtime events** — `market:stock-updated`, `market:order-updated`, `market:trade-executed`
- **Engine crash recovery** — WAL logs + snapshots + MongoDB backup replay

---

## Architecture

```
┌─────────────┐     REST / WS      ┌──────────────┐     HTTP      ┌─────────────────┐
│ React Client│ ◄────────────────► │ Node.js API  │ ◄───────────► │ Java Engine     │
│  (Vite)     │   localhost:5000   │  (Express)   │  :8080/orders │ (MatchingEngine)│
└─────────────┘                    └──────┬───────┘               └────────┬────────┘
                                          │                                │
                                          ▼                                ▼
                                   ┌──────────────┐               ┌─────────────────┐
                                   │   MongoDB    │               │ engine-wal.log  │
                                   │ trading_system│               │ engine-snapshot │
                                   └──────────────┘               └─────────────────┘
```

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, Socket.IO Client, Recharts |
| Backend | Node.js, Express 5, Mongoose, JWT, bcrypt, node-cron, Socket.IO, Redis (optional) |
| Matching engine | Java 17+, `com.sun.net.httpserver`, in-memory order books |
| Database | MongoDB (`trading_system`) |

---

## Project structure

```
Trading_System/
├── client/          # React frontend
├── server/          # Express API + business logic
│   └── app/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── service/       # createOrder, IPO close, engine recovery
│       ├── realtime/      # Socket.IO + optional Redis pub/sub
│       └── scheduler/     # IPO open/close cron
└── engine/          # Java matching engine
    └── src/
        ├── EngineHttpServer.java
        ├── model/           # Order, Trade, enums
        └── service/         # OrderBook, MatchingEngine, EnginePersistence
```

---

## DSA & algorithmic concepts

### 1. Order book — `TreeMap` + `Queue` (price-time priority)

The matching engine stores resting limit orders per symbol in two sorted maps:

| Side | Structure | Ordering |
|------|-----------|----------|
| BUY book | `TreeMap<Double, Queue<Order>>` | Descending price (best bid first) |
| SELL book | `TreeMap<Double, Queue<Order>>` | Ascending price (best ask first) |

Each price level holds a **`LinkedList` queue** for FIFO time priority at the same price.

- **TreeMap** → O(log n) insert/lookup per price level; sorted iteration for matching
- **Queue (FIFO)** → O(1) enqueue/dequeue; fair execution among orders at the same price

This is the standard exchange order-book pattern: **price priority first, time priority second**.

### 2. Matching algorithm — greedy iteration

`LimitOrder` and `MarketOrder` walk the opposite side of the book:

- **Limit BUY** — iterate sell levels from lowest price; stop when `sellPrice > limit`
- **Limit SELL** — iterate buy levels from highest price; stop when `buyPrice < limit`
- **Market orders** — consume best available levels until filled or book exhausted

Partial fills use `min(incomingQty, restingQty)`. Empty price levels are removed from the `TreeMap`.

**Time complexity (per order):** O(P × Q) where P = price levels touched, Q = orders at each level (typical case is small).

### 3. Strategy pattern — `OrderHandler`

`MatchingEngine` dispatches to `LimitOrder` or `MarketOrder` via a common `OrderHandler` interface — separates matching rules without duplicating book logic.

### 4. IPO cutoff — prefix sum / running total

In `closeIPOInternal.js`, bids are sorted by price (desc) and time. A **running demand** accumulates bid quantities until demand ≥ total IPO shares — the bid at that point sets the **cutoff price**.

```
runningDemand = 0
for each bid (highest price first):
    runningDemand += bid.quantity
    if runningDemand >= totalShares:
        cutoffPrice = bid.price
        break
```

This is a **prefix sum** style scan: O(n) after O(n log n) sort.

### 5. IPO allocation — multi-pass greedy

1. Bids above cutoff → full allocation (greedy, price-priority)
2. Bids at cutoff → proportional fill by arrival order until shares exhausted
3. Bids below cutoff → rejected

### 6. Ledger as implicit balance — append-only chain

Wallet balance is derived from the **latest ledger entry** (`sort by createdAt, _id`), not a mutable balance field alone. Each operation appends a record with `balanceAfter` — an event-sourcing-lite pattern.

### 7. Engine persistence — WAL + snapshot recovery

| Concept | Implementation |
|---------|----------------|
| Write-ahead log (WAL) | `engine-wal.log` — append `ORDER_SUBMIT`, `TRADE_EXECUTED`, `ORDER_RESTED` |
| Checkpoint / snapshot | `engine-snapshot.json` every 25 events |
| Recovery | Load snapshot → replay WAL events with `seq > lastAppliedSeq` |
| Idempotency | `Set<String>` of processed order IDs to skip duplicates |
| Backup recovery | Node replays `OPEN`/`PARTIAL` limit orders from MongoDB via `POST /recover` |

### 8. Hash map registry — symbol → order book

`ExchangeService` uses `HashMap<String, OrderBook>` for O(1) average lookup of books by ticker symbol.

### 9. MongoDB transactions — `session` + `startTransaction`

`createOrder` and IPO settlement use multi-document ACID transactions so orders, ledgers, portfolios, and trades stay consistent.

---

## Getting started

### 1. Environment

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key
JAVA_ENGINE_URL=http://localhost:8080
CLIENT_ORIGIN=http://localhost:5173
```

**`client/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 2. Java matching engine

```bash
cd engine/src
javac EngineHttpServer.java Main.java model/*.java service/*.java
java EngineHttpServer 8080 ../data
```

Persistence files are written to `engine/data/`.

### 3. Node API

```bash
cd server
npm install
npm run dev
```

On startup, the server syncs open limit orders to the engine via `/recover`.

### 4. React client

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## API overview

| Area | Base path |
|------|-----------|
| User auth | `/api/auth-user` |
| Company auth | `/api/auth-company` |
| Stocks | `/api/stock` |
| Orders | `/api/order` |
| Funds | `/api/funds` |
| User data | `/api/user` |
| IPO | `/api/ipo` |
| Company | `/api/company` |

Full request/response contracts: [`server/FRONTEND_BACKEND_API.md`](server/FRONTEND_BACKEND_API.md)

### Java engine endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/orders` | Place and match an order |
| GET | `/orderbook?symbol=TATA` | View resting book |
| POST | `/recover` | Replay open orders from DB |
| GET | `/persistence/status` | WAL sequence + live snapshot |

Details: [`engine/README.md`](engine/README.md)

---

## Realtime events (Socket.IO)

| Event | Payload | When |
|-------|---------|------|
| `market:stock-updated` | Stock document | Price changes after a trade |
| `market:order-updated` | Order + stock | Any order placement or fill |
| `market:trade-executed` | Order + trades + stock | Trade execution |
| `realtime:ready` | `{ message }` | Client connects |

---

## Order lifecycle (simplified)

```
User places order
    → Node locks funds (BUY) or shares (SELL) in MongoDB transaction
    → Node sends order to Java engine
    → Engine matches against in-memory book
    → Trades returned to Node
    → Node updates ledgers, portfolios, order status, stock price
    → Socket events broadcast to clients
    → Unfilled LIMIT remainder rests on engine book (logged to WAL)
```

---

## Scripts

| Package | Command | Purpose |
|---------|---------|---------|
| `client` | `npm run dev` | Start Vite dev server |
| `client` | `npm run build` | Production build |
| `server` | `npm run dev` | Nodemon API server |
| `server` | `npm start` | Production API server |
| `engine` | `java EngineHttpServer 8080 ../data` | Start matcher with persistence |

---


