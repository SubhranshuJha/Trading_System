# 🚀 Trading Engine (Java Order Matching System)

A lightweight **limit order matching engine** built in Java with an embedded HTTP server.
It simulates core exchange functionality including **order placement, matching, trade execution, and order book management**.

---

## 📌 Overview

This system allows users to:

* Place BUY and SELL orders
* Automatically match orders using **price-time priority**
* Execute trades
* View real-time order book

---

## 🏗️ Architecture

```text
Client → HTTP Server → ExchangeService → OrderBook → Matching Engine → Trade
```

---

## ⚙️ Core Components

### 🧾 Order

Represents a trading request.

```text
id, symbol, userId, type (BUY/SELL), category (LIMIT), price, quantity
```

---

### 📚 OrderBook

Maintains orders per symbol:

* BUY orders → sorted **descending (highest price first)**
* SELL orders → sorted **ascending (lowest price first)**

Uses:

```text
TreeMap<Integer, Queue<Order>>
```

* TreeMap → price priority
* Queue → FIFO (time priority)

---

### 🔄 Matching Engine

Implements:

* BUY matches lowest SELL ≤ price
* SELL matches highest BUY ≥ price
* Partial order execution
* Removes completed orders

---

### 💰 Trade

Represents executed trades:

```text
tradeId, buyOrderId, sellOrderId, symbol, price, quantity, totalValue
```

---

## 📡 API Endpoints

### 🟢 Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

---

### ▶️ Place Order

```http
POST /orders
```

#### Request:

```json
{
  "id": "1",
  "symbol": "TATA",
  "userId": "u1",
  "type": "BUY",
  "category": "LIMIT",
  "price": 100,
  "quantity": 10
}
```

#### Response:

```json
{
  "remainingQuantity": 5,
  "trades": [
    {
      "id": "t1",
      "buyOrderId": "1",
      "sellOrderId": "2",
      "symbol": "TATA",
      "price": 100,
      "quantity": 5,
      "totalValue": 500
    }
  ]
}
```

---

### 📊 Get OrderBook

```http
GET /orderbook?symbol=TATA
```

#### Response:

```json
{
  "symbol": "TATA",
  "buy": [
    {
      "id": "1",
      "userId": "u1",
      "price": 100,
      "quantity": 5
    }
  ],
  "sell": []
}
```

---

## 🔥 Example Flow

### Step 1: Place Orders

```text
BUY  → 10 @ 100
SELL → 5 @ 90
```

---

### Step 2: Matching

```text
Trade executed:
5 units @ 90
```

---

### Step 3: Result

```text
Remaining BUY → 5 @ 100
SELL → empty
```

---

## ⚡ Key Features

* ✅ Price-Time Priority Matching
* ✅ FIFO execution within same price
* ✅ Partial fills supported
* ✅ Efficient data structures (TreeMap + Queue)
* ✅ Lightweight HTTP server (no heavy frameworks)

---

## 🧩 Data Structures

| Component | Structure | Purpose             |
| --------- | --------- | ------------------- |
| OrderBook | TreeMap   | Sorted price levels |
| Orders    | Queue     | FIFO execution      |
| Matching  | Iteration | Efficient traversal |

---

## 🚀 How to Run

### 1. Compile

```bash
cd src
javac EngineHttpServer.java Main.java model/*.java service/*.java
```

---

### 2. Run Server

```bash
cd src
java EngineHttpServer
```

Optional arguments:

```bash
java EngineHttpServer 8080 ./data
```

- `8080` → HTTP port
- `./data` → persistence directory for WAL + snapshots

Server starts at:

```text
http://localhost:8080
```

---

## 💾 Persistence and Recovery

The engine now writes durable logs so in-memory order books can be rebuilt after a crash.

### Files (inside `data/` by default)

| File | Purpose |
| ---- | ------- |
| `engine-wal.log` | Append-only event log (`ORDER_SUBMIT`, `TRADE_EXECUTED`, `ORDER_RESTED`) |
| `engine-snapshot.json` | Periodic checkpoint of all resting limit orders |

### Recovery flow on startup

1. Load the latest `engine-snapshot.json` (if present)
2. Replay `ORDER_SUBMIT` events from `engine-wal.log` with `seq > lastAppliedSeq`
3. Skip duplicate order IDs already present in the book

### Extra endpoints

```http
GET /persistence/status
```

Returns current sequence number and a live snapshot.

```http
POST /recover
```

Replays open limit orders sent from the Node server (MongoDB backup recovery).

Example body:

```json
{
  "orders": [
    {
      "id": "665f...",
      "symbol": "TATA",
      "userId": "u1",
      "type": "BUY",
      "category": "LIMIT",
      "price": 100,
      "quantity": 5
    }
  ]
}
```

The Node server automatically calls `/recover` on startup for `OPEN`/`PARTIAL` limit orders still in MongoDB.

---

### 3. Test APIs

#### Place Order

```bash
curl.exe -X POST http://localhost:8080/orders \
-H "Content-Type: application/json" \
-d "{\"id\":\"1\",\"symbol\":\"TATA\",\"userId\":\"u1\",\"type\":\"BUY\",\"category\":\"LIMIT\",\"price\":100,\"quantity\":10}"
```

---

#### Get OrderBook

```bash
curl.exe "http://localhost:8080/orderbook?symbol=TATA"
```

---

## 🧠 Design Highlights

* Separation of concerns (Order, Trade, OrderBook, Engine)
* Efficient matching using sorted maps
* Stateless HTTP interface over in-memory engine

