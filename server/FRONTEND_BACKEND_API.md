# Backend API Guide for Frontend Developers

This document is the frontend-facing contract for the backend in this project. It shows the exact endpoints, required headers, request bodies, and example responses returned by the current controllers.

## Base URL

Local development server:

- `http://localhost:5000`

Health check:

- `GET /`

## Common Conventions

- All JSON endpoints use `Content-Type: application/json`.
- Protected routes require `Authorization: Bearer <token>`.
- User auth and company auth are separate flows and must be stored separately on the frontend.
- Some error responses return `{ success: false, message: "..." }`, while a few endpoints return only `{ message: "..." }` on failure. The examples below follow the current backend behavior.

### Common success shape

```json
{
  "success": true,
  "message": "..."
}
```

### Common error shape

```json
{
  "success": false,
  "message": "..."
}
```

## Authentication

### User auth

#### Register user

- `POST /api/auth-user/register`

Request

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "StrongPass@123",
  "type": "USER"
}
```

Example success response

```json
{
  "success": true,
  "message": "user registered successfully."
}
```

Example error response

```json
{
  "success": false,
  "message": "user registration failed ! All fields are required."
}
```

Notes:

- `type` is optional.
- If `type` is `COMPANY`, the user record is saved with company type; otherwise it defaults to `USER`.
- Password must include uppercase, lowercase, digit, special character, and be at least 8 characters.

#### Login user

- `POST /api/auth-user/login`

Request

```json
{
  "email": "user@example.com",
  "password": "StrongPass@123"
}
```

Example success response

```json
{
  "success": true,
  "message": "user logged in successfully.",
  "token": "jwt-token-here"
}
```

Example error response

```json
{
  "success": false,
  "message": "user login failed ! Invalid email or password."
}
```

#### Logout user

- `POST /api/auth-user/logout`

Headers

```http
Authorization: Bearer <user-token>
```

Example success response

```json
{
  "success": true,
  "message": "user logged out successfully."
}
```

Example error response

```json
{
  "success": false,
  "message": "user logout failed ! Token is required."
}
```

### Company auth

#### Register company

- `POST /api/auth-company/register`

Request

```json
{
  "email": "company@example.com",
  "name": "Company Name",
  "password": "StrongPass@123",
  "description": "Optional company description",
  "symbol": "ABC"
}
```

Example success response

```json
{
  "success": true,
  "message": "company registered successfully."
}
```

Example error response

```json
{
  "success": false,
  "message": "company registration failed ! All fields are required."
}
```

Notes:

- `symbol` is uppercased by the backend.
- Password rules are the same as user registration.

#### Login company

- `POST /api/auth-company/login`

Request

```json
{
  "email": "company@example.com",
  "password": "StrongPass@123"
}
```

Example success response

```json
{
  "success": true,
  "message": "company logged in successfully.",
  "token": "jwt-token-here"
}
```

Example error response

```json
{
  "success": false,
  "message": "company login failed ! Invalid email or password."
}
```

#### Logout company

- `POST /api/auth-company/logout`

Headers

```http
Authorization: Bearer <company-token>
```

Example success response

```json
{
  "success": true,
  "message": "company logged out successfully."
}
```

Example error response

```json
{
  "success": false,
  "message": "company logout failed ! Token is required."
}
```

## Public Routes

### Health check

- `GET /`

Example response

```text
Server is running
```

### Stocks

#### Get all stocks

- `GET /api/stock/all`

Example success response

```json
{
  "success": true,
  "message": "Stocks fetched successfully",
  "data": [
    {
      "_id": "66c111111111111111111111",
      "name": "ABC Industries",
      "symbol": "ABC",
      "totalShares": 100000,
      "issuedShares": 0,
      "currentPrice": 0,
      "isListed": false,
      "isActive": true,
      "createdBy": "66c222222222222222222222",
      "createdAt": "2026-05-01T10:00:00.000Z",
      "updatedAt": "2026-05-01T10:00:00.000Z"
    }
  ]
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to fetch stocks"
}
```

#### Create stock

- `POST /api/stock/create`

Headers

```http
Authorization: Bearer <company-token>
Content-Type: application/json
```

Request

```json
{
  "name": "ABC Industries",
  "quantity": 100000
}
```

Example success response

```json
{
  "success": true,
  "message": "Stock created successfully",
  "data": {
    "_id": "66c111111111111111111111",
    "name": "ABC Industries",
    "symbol": "ABC",
    "totalShares": 100000,
    "issuedShares": 0,
    "currentPrice": 0,
    "isListed": false,
    "isActive": true,
    "createdBy": "66c222222222222222222222",
    "createdAt": "2026-05-01T10:00:00.000Z",
    "updatedAt": "2026-05-01T10:00:00.000Z"
  }
}
```

Example error response

```json
{
  "success": false,
  "message": "Stock with the same symbol already exists"
}
```

#### Get stock by symbol

- `GET /api/stock/:symbol`

Example request

```http
GET /api/stock/ABC
Authorization: Bearer <company-token>
```

Example success response

```json
{
  "success": true,
  "message": "Stock fetched successfully",
  "data": {
    "_id": "66c111111111111111111111",
    "name": "ABC Industries",
    "symbol": "ABC",
    "totalShares": 100000,
    "issuedShares": 0,
    "currentPrice": 0,
    "isListed": false,
    "isActive": true,
    "createdBy": "66c222222222222222222222",
    "createdAt": "2026-05-01T10:00:00.000Z",
    "updatedAt": "2026-05-01T10:00:00.000Z"
  }
}
```

Example error response

```json
{
  "success": false,
  "message": "Stock not found"
}
```

### IPOs

#### Get all IPOs

- `GET /api/ipo`

Example success response

```json
{
  "success": true,
  "ipos": [
    {
      "_id": "66c333333333333333333333",
      "stockId": {
        "_id": "66c111111111111111111111",
        "name": "ABC Industries",
        "symbol": "ABC"
      },
      "totalShares": 10000,
      "priceRange": {
        "min": 90,
        "max": 110
      },
      "cutoffPrice": null,
      "lotSize": 10,
      "soldShares": 0,
      "status": "UPCOMING",
      "startDate": "2026-05-01T00:00:00.000Z",
      "endDate": "2026-05-15T00:00:00.000Z",
      "createdBy": "66c222222222222222222222",
      "createdAt": "2026-05-01T10:00:00.000Z",
      "updatedAt": "2026-05-01T10:00:00.000Z"
    }
  ]
}
```

Example error response

```json
{
  "message": "some error message"
}
```

#### Get IPO by company symbol

- `GET /api/ipo/:symbol`

Example request

```http
GET /api/ipo/ABC
```

Example success response

```json
{
  "success": true,
  "ipo": {
    "_id": "66c333333333333333333333",
    "stockId": {
      "_id": "66c111111111111111111111",
      "name": "ABC Industries",
      "symbol": "ABC"
    },
    "totalShares": 10000,
    "priceRange": {
      "min": 90,
      "max": 110
    },
    "lotSize": 10,
    "status": "OPEN"
  }
}
```

Example error response

```json
{
  "message": "IPO not found"
}
```

#### Place IPO bid

- `POST /api/ipo/:id/bid`

Headers

```http
Authorization: Bearer <user-token>
Content-Type: application/json
```

Request

```json
{
  "quantity": 100,
  "bidPrice": 95
}
```

Example success response

```json
{
  "success": true,
  "bid": {
    "_id": "66c444444444444444444444",
    "userId": "66c555555555555555555555",
    "ipoId": "66c333333333333333333333",
    "quantity": 100,
    "bidPrice": 95,
    "status": "PENDING",
    "createdAt": "2026-05-01T10:15:00.000Z",
    "updatedAt": "2026-05-01T10:15:00.000Z"
  }
}
```

Example error response

```json
{
  "message": "Bid price must be within IPO price range"
}
```

#### Create IPO

- `POST /api/ipo/create`

Headers

```http
Authorization: Bearer <company-token>
Content-Type: application/json
```

Request

```json
{
  "stockId": "66c111111111111111111111",
  "totalShares": 10000,
  "priceRange": {
    "min": 90,
    "max": 110
  },
  "startDate": "2026-05-01T00:00:00.000Z",
  "endDate": "2026-05-15T00:00:00.000Z",
  "lotSize": 10
}
```

Example success response

```json
{
  "success": true,
  "ipo": {
    "_id": "66c333333333333333333333",
    "stockId": "66c111111111111111111111",
    "totalShares": 10000,
    "priceRange": {
      "min": 90,
      "max": 110
    },
    "lotSize": 10,
    "soldShares": 0,
    "status": "UPCOMING",
    "startDate": "2026-05-01T00:00:00.000Z",
    "endDate": "2026-05-15T00:00:00.000Z",
    "createdBy": "66c222222222222222222222",
    "createdAt": "2026-05-01T10:00:00.000Z",
    "updatedAt": "2026-05-01T10:00:00.000Z"
  }
}
```

Example error response

```json
{
  "message": "Stock already listed"
}
```

#### Close IPO

- `PATCH /api/ipo/:id/close`

Headers

```http
Authorization: Bearer <company-token>
```

Example request

```http
PATCH /api/ipo/66c333333333333333333333/close
```

Example success response

```json
{
  "success": true,
  "message": "IPO closed",
  "result": {
    "status": "CLOSED"
  }
}
```

Example error response

```json
{
  "message": "IPO not found"
}
```

## User Protected Routes

All routes in this section require:

- `Authorization: Bearer <user-token>`

### User profile

- `GET /api/user/profile`

Example success response

```json
{
  "success": true,
  "message": "User data fetched successfully !",
  "user": {
    "_id": "66c555555555555555555555",
    "email": "user@example.com",
    "name": "User Name",
    "type": "USER",
    "createdAt": "2026-05-01T09:00:00.000Z",
    "updatedAt": "2026-05-01T09:00:00.000Z"
  }
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to get user data ! User not found."
}
```

### User orders

- `GET /api/user/orders`

Example success response

```json
{
  "success": true,
  "message": "User orders fetched successfully !",
  "orders": [
    {
      "_id": "66c666666666666666666666",
      "userId": "66c555555555555555555555",
      "symbol": "ABC",
      "type": "BUY",
      "category": "LIMIT",
      "price": 100,
      "quantity": 10,
      "remainingQty": 0,
      "status": "COMPLETED",
      "createdAt": "2026-05-01T10:20:00.000Z",
      "updatedAt": "2026-05-01T10:20:00.000Z"
    }
  ]
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to get user orders ! Something went wrong."
}
```

### User trades

- `GET /api/user/trades`

Example success response

```json
{
  "success": true,
  "message": "User trades fetched successfully !",
  "trades": [
    {
      "_id": "66c777777777777777777777",
      "buyerId": "66c555555555555555555555",
      "sellerId": "66c888888888888888888888",
      "buyOrderId": "66c666666666666666666666",
      "sellOrderId": "66c999999999999999999999",
      "symbol": "ABC",
      "price": 100,
      "quantity": 10,
      "totalAmount": 1000,
      "type": "SECONDARY",
      "createdAt": "2026-05-01T10:25:00.000Z",
      "updatedAt": "2026-05-01T10:25:00.000Z"
    }
  ]
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to get user trades ! Something went wrong."
}
```

### User balance

- `GET /api/user/balance`

Example success response

```json
{
  "success": true,
  "message": "User balance fetched successfully !",
  "balance": 25000
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to get user balance ! Something went wrong."
}
```

### User portfolio

- `GET /api/user/portfolio`

Example success response with portfolio

```json
{
  "success": true,
  "message": "User portfolio fetched successfully !",
  "portfolio": {
    "_id": "66caaaaaaaabbbbbbbbbb",
    "userId": "66c555555555555555555555",
    "stocks": [
      {
        "stockId": {
          "_id": "66c111111111111111111111",
          "symbol": "ABC",
          "name": "ABC Industries"
        },
        "quantity": 10,
        "averagePrice": 100
      }
    ]
  }
}
```

Example success response without portfolio

```json
{
  "success": true,
  "portfolio": {
    "stocks": []
  }
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to get user portfolio ! Something went wrong."
}
```

### Add funds

- `POST /api/funds/add`

Headers

```http
Authorization: Bearer <user-token>
Content-Type: application/json
```

Request

```json
{
  "amount": 10000
}
```

Example success response

```json
{
  "success": true,
  "message": "Funds added successfully !"
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to add funds ! Amount is required."
}
```

### Place buy order

- `POST /api/order/buy`

Headers

```http
Authorization: Bearer <user-token>
Content-Type: application/json
```

Request

```json
{
  "stockSymbol": "ABC",
  "quantity": 10,
  "price": 100,
  "category": "LIMIT"
}
```

Example success response

```json
{
  "success": true,
  "message": "Buy order placed successfully !",
  "order": {
    "_id": "66c666666666666666666666",
    "userId": "66c555555555555555555555",
    "symbol": "ABC",
    "type": "BUY",
    "category": "LIMIT",
    "price": 100,
    "quantity": 10,
    "remainingQty": 10,
    "status": "OPEN",
    "createdAt": "2026-05-01T10:20:00.000Z",
    "updatedAt": "2026-05-01T10:20:00.000Z"
  }
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to place buy order ! All fields are required."
}
```

Notes:

- `category` must be `LIMIT` or `MARKET`.
- `stockSymbol` is normalized to uppercase.

### Place sell order

- `POST /api/order/sell`

Headers

```http
Authorization: Bearer <user-token>
Content-Type: application/json
```

Request

```json
{
  "stockSymbol": "ABC",
  "quantity": 10,
  "price": 100,
  "category": "LIMIT"
}
```

Example success response

```json
{
  "success": true,
  "message": "Sell order placed successfully !",
  "order": {
    "_id": "66c999999999999999999999",
    "userId": "66c555555555555555555555",
    "symbol": "ABC",
    "type": "SELL",
    "category": "LIMIT",
    "price": 100,
    "quantity": 10,
    "remainingQty": 10,
    "status": "OPEN",
    "createdAt": "2026-05-01T10:30:00.000Z",
    "updatedAt": "2026-05-01T10:30:00.000Z"
  }
}
```

Example error response

```json
{
  "success": false,
  "message": "Unable to place sell order ! All fields are required."
}
```

## Company Protected Routes

All routes in this section require:

- `Authorization: Bearer <company-token>`

### Company profile

- `GET /api/company/profile`

Example success response

```json
{
  "success": true,
  "company": {
    "_id": "66c222222222222222222222",
    "name": "ABC Holdings",
    "symbol": "ABC",
    "email": "company@example.com",
    "description": "Optional company description",
    "createdAt": "2026-05-01T09:00:00.000Z",
    "updatedAt": "2026-05-01T09:00:00.000Z"
  },
  "ledger": [
    {
      "_id": "66cb00000000000000000000",
      "companyId": "66c222222222222222222222",
      "amount": 0,
      "type": "FUND",
      "balanceAfter": 0,
      "createdAt": "2026-05-01T09:00:00.000Z",
      "updatedAt": "2026-05-01T09:00:00.000Z"
    }
  ]
}
```

Example error response

```json
{
  "success": false,
  "message": "Company not found"
}
```

### Company IPOs

- `GET /api/company/ipos`

Example success response

```json
{
  "success": true,
  "ipos": [
    {
      "_id": "66c333333333333333333333",
      "stockId": {
        "_id": "66c111111111111111111111",
        "name": "ABC Industries",
        "symbol": "ABC"
      },
      "totalShares": 10000,
      "priceRange": {
        "min": 90,
        "max": 110
      },
      "lotSize": 10,
      "status": "OPEN"
    }
  ]
}
```

Example error response

```json
{
  "message": "Internal Server Error"
}
```

### Company trades

- `GET /api/company/trades`

Example success response

```json
{
  "success": true,
  "trades": [
    {
      "_id": "66c777777777777777777777",
      "buyerId": {
        "_id": "66c555555555555555555555",
        "name": "User Name",
        "email": "user@example.com"
      },
      "sellerId": {
        "_id": "66c222222222222222222222",
        "name": "ABC Holdings",
        "email": "company@example.com"
      },
      "symbol": "ABC",
      "price": 100,
      "quantity": 10,
      "totalAmount": 1000,
      "type": "SECONDARY"
    }
  ]
}
```

Example error response

```json
{
  "message": "Internal Server Error"
}
```

### Company stock details

- `GET /api/company/stock-details`

Example success response

```json
{
  "success": true,
  "stockDetails": {
    "_id": "66c111111111111111111111",
    "name": "ABC Industries",
    "symbol": "ABC",
    "totalShares": 100000,
    "issuedShares": 0,
    "currentPrice": 0,
    "isListed": false,
    "isActive": true,
    "createdBy": "66c222222222222222222222"
  }
}
```

Example error response

```json
{
  "success": false,
  "message": "Stock details not found for the company"
}
```

## Important Data Shapes

### User

```json
{
  "_id": "66c555555555555555555555",
  "email": "user@example.com",
  "name": "User Name",
  "type": "USER",
  "createdAt": "2026-05-01T09:00:00.000Z",
  "updatedAt": "2026-05-01T09:00:00.000Z"
}
```

### Company

```json
{
  "_id": "66c222222222222222222222",
  "name": "ABC Holdings",
  "symbol": "ABC",
  "email": "company@example.com",
  "description": "Optional company description",
  "createdAt": "2026-05-01T09:00:00.000Z",
  "updatedAt": "2026-05-01T09:00:00.000Z"
}
```

### Stock

```json
{
  "_id": "66c111111111111111111111",
  "name": "ABC Industries",
  "symbol": "ABC",
  "totalShares": 100000,
  "issuedShares": 0,
  "currentPrice": 0,
  "isListed": false,
  "isActive": true,
  "createdBy": "66c222222222222222222222"
}
```

### IPO

```json
{
  "_id": "66c333333333333333333333",
  "stockId": "66c111111111111111111111",
  "totalShares": 10000,
  "priceRange": {
    "min": 90,
    "max": 110
  },
  "cutoffPrice": null,
  "lotSize": 10,
  "soldShares": 0,
  "status": "OPEN",
  "startDate": "2026-05-01T00:00:00.000Z",
  "endDate": "2026-05-15T00:00:00.000Z",
  "createdBy": "66c222222222222222222222"
}
```

### Order

```json
{
  "_id": "66c666666666666666666666",
  "userId": "66c555555555555555555555",
  "symbol": "ABC",
  "type": "BUY",
  "category": "LIMIT",
  "price": 100,
  "quantity": 10,
  "remainingQty": 10,
  "status": "OPEN"
}
```

### Trade

```json
{
  "_id": "66c777777777777777777777",
  "buyerId": "66c555555555555555555555",
  "sellerId": "66c888888888888888888888",
  "buyOrderId": "66c666666666666666666666",
  "sellOrderId": "66c999999999999999999999",
  "bidId": "66c444444444444444444444",
  "symbol": "ABC",
  "price": 100,
  "quantity": 10,
  "totalAmount": 1000,
  "type": "SECONDARY"
}
```

### Ledger

```json
{
  "_id": "66cb00000000000000000000",
  "userId": "66c555555555555555555555",
  "companyId": null,
  "symbol": "ABC",
  "quantity": 10,
  "price": 100,
  "amount": 1000,
  "type": "LOCK",
  "balanceAfter": 15000,
  "referenceId": "66c444444444444444444444",
  "referenceModel": "Bid"
}
```

## Frontend Integration Notes

- Store the JWT after login and attach it to protected requests.
- Keep user auth state and company auth state separate.
- After buy, sell, add funds, IPO bid, and IPO close actions, refresh the views that depend on balance, portfolio, orders, trades, or IPO state.
- If the API returns a 401, clear local auth state and route the user back to the appropriate login screen.
