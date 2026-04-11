# Trading Engine (Java)

This folder contains the Java matching engine and an HTTP entry-point server so Node can send requests to it.

## Run The Engine Server

From `d:\Trading_System`:

```powershell
javac -d engine\out (Get-ChildItem -Recurse engine\src\*.java | Where-Object { $_.Name -ne 'Main.java' } | ForEach-Object { $_.FullName })
java -cp engine\out EngineHttpServer 8080
```

If you do not pass a port, default is `8080`.

## API Endpoints

### 1) Health

- Method: `GET`
- URL: `http://localhost:8080/health`

Response:

```json
{"status":"ok"}
```

### 2) Place Order

- Method: `POST`
- URL: `http://localhost:8080/orders`
- Content-Type: `application/json`

Request body:

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

Rules:

- `type`: `BUY` or `SELL`
- `category`: `LIMIT` or `MARKET`
- `price` and `quantity` must be integers

Response includes:

- `remainingQuantity`: quantity left after matching
- `trades`: list of executed trades

### 3) Get OrderBook

- Method: `GET`
- URL: `http://localhost:8080/orderbook?symbol=TATA`

Response:

```json
{
  "symbol": "TATA",
  "buy": [
    {"id":"1","userId":"u1","price":100,"quantity":5}
  ],
  "sell": []
}
```

## Node.js Usage Example

```js
const place = await fetch("http://localhost:8080/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: "1",
    symbol: "TATA",
    userId: "u1",
    type: "BUY",
    category: "LIMIT",
    price: 100,
    quantity: 10
  })
});

console.log(await place.json());

const book = await fetch("http://localhost:8080/orderbook?symbol=TATA");
console.log(await book.json());
```

## Quick Curl Test

```bash
curl http://localhost:8080/health
curl -X POST http://localhost:8080/orders -H "Content-Type: application/json" -d "{\"id\":\"1\",\"symbol\":\"TATA\",\"userId\":\"u1\",\"type\":\"BUY\",\"category\":\"LIMIT\",\"price\":100,\"quantity\":10}"
curl "http://localhost:8080/orderbook?symbol=TATA"
```

