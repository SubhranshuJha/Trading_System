# 🚀 Trading Engine (Order Matching System)

A high-performance **limit order matching engine** built in Java that simulates the core functionality of a stock exchange.

---

## 📌 Overview

This project implements a **price-time priority based matching engine** that:

* Accepts BUY and SELL orders
* Matches them based on price
* Executes trades
* Maintains an order book

---

## ⚙️ Core Components

### 🧾 Order

Represents a user order.

```
id, symbol, userId, type (BUY/SELL), category (LIMIT), price, quantity
```

---

### 📚 OrderBook

Maintains active orders:

* **Buy Orders** → sorted in **descending order (highest price first)**
* **Sell Orders** → sorted in **ascending order (lowest price first)**

```
BUY  → TreeMap (descending)
SELL → TreeMap (ascending)
```

Each price level stores:

```
Queue<Order> → ensures FIFO (time priority)
```

---

### 🔄 Matching Engine

Handles order execution:

* BUY matches lowest SELL
* SELL matches highest BUY
* Supports partial fills
* Removes completed orders

---

### 💰 Trade

Represents executed transactions:

```
tradeId, buyOrderId, sellOrderId, symbol, price, quantity
```

---

## 🧠 Matching Logic

### ✅ BUY Order

Matches with **lowest SELL price ≤ buy price**

### ✅ SELL Order

Matches with **highest BUY price ≥ sell price**

---

## 🔥 Example Flow

### Step 1: Place Orders

```
BUY  → 10 @ 100
SELL → 5 @ 90
```

---

### Step 2: Matching

```
Trade executed:
5 units @ 90
```

---

### Step 3: Result

```
Remaining:
BUY → 5 @ 100
SELL → empty
```

---

## 📡 API Endpoints

### ▶️ Place Order

```
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

---

### 📊 Get OrderBook

```
GET /orderbook?symbol=TATA
```

#### Response:

```json
{
  "symbol": "TATA",
  "buy": [
    {
      "price": 100,
      "totalQuantity": 5
    }
  ],
  "sell": []
}
```

---

### 🔄 Trade Response (on match)

```json
{
  "trades": [
    {
      "tradeId": "t1",
      "buyOrderId": "1",
      "sellOrderId": "2",
      "price": 100,
      "quantity": 5
    }
  ]
}
```

---

## ⚡ Key Features

* ✅ Price-Time Priority Matching
* ✅ Partial Order Execution
* ✅ FIFO within same price level
* ✅ Efficient data structures (TreeMap + Queue)
* ✅ Clean modular design

---

## 🏗️ Architecture

```
User → Order → OrderBook → Matching Engine → Trade
```

---

## 🧩 Data Structures Used

| Component            | Structure | Reason              |
| -------------------- | --------- | ------------------- |
| OrderBook            | TreeMap   | Sorted price levels |
| Orders at same price | Queue     | FIFO execution      |
| Matching             | Iteration | Efficient traversal |

---

## 🚀 Future Improvements

* Market Orders
* Stop Loss Orders
* Persistent Storage (DB)
* Concurrency handling
* WebSocket live updates
* Balance + Ledger system

---

## 🧠 Interview Insights

This project demonstrates:

* System Design thinking
* Efficient data structures
* Real-world trading logic
* Clean separation of concerns

---

## 📌 How to Run

```bash
# Start server
mvn spring-boot:run

# Place order
curl.exe -X POST http://localhost:8080/orders \
-H "Content-Type: application/json" \
-d "{\"id\":\"1\",\"symbol\":\"TATA\",\"userId\":\"u1\",\"type\":\"BUY\",\"category\":\"LIMIT\",\"price\":100,\"quantity\":10}"

# Check orderbook
curl.exe "http://localhost:8080/orderbook?symbol=TATA"
```

---

