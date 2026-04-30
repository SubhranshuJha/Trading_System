# Backend API Guide for Frontend Developers

This document is the frontend-facing contract for the backend in this project. It focuses on what the UI needs to call, what headers to send, and the shape of the main responses.

## Base URL

Local development server:

- `http://localhost:5000`

The server exposes a simple health check at `/`.

## Common Conventions

- All requests use JSON bodies unless noted otherwise.
- Protected routes require an `Authorization` header in the form `Bearer <token>`.
- Tokens are JWTs returned from the login endpoints.
- Logout works by blacklisting the current token, so the frontend should remove the token from storage after a successful logout.

### Typical success response

Most endpoints return JSON shaped like this:

```json
{
  "success": true,
  "message": "..."
}
```

Some endpoints also include a resource payload such as `token`, `user`, `company`, `stockDetails`, `orders`, `trades`, `portfolio`, `bid`, `ipo`, or `data`.

### Typical error response

```json
{
  "success": false,
  "message": "..."
}
```

## Authentication

There are two auth flows:

- User auth for trading users.
- Company auth for company/admin actions.

Both login endpoints return a JWT token that should be sent in `Authorization: Bearer <token>`.

### User Auth

#### Register user

- `POST /api/auth-user/register`

Request body:

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "StrongPass@123",
  "type": "USER"
}
```

Notes:

- `type` is optional.
- If `type` is `COMPANY`, the user record is saved with company type; otherwise it defaults to `USER`.
- Password must include uppercase, lowercase, digit, special character, and be at least 8 characters.

#### Login user

- `POST /api/auth-user/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "StrongPass@123"
}
```

Response includes:

```json
{
  "success": true,
  "message": "user logged in successfully.",
  "token": "jwt-token-here"
}
```

#### Logout user

- `POST /api/auth-user/logout`

Headers:

- `Authorization: Bearer <token>`

### Company Auth

#### Register company

- `POST /api/auth-company/register`

Request body:

```json
{
  "email": "company@example.com",
  "name": "Company Name",
  "password": "StrongPass@123",
  "description": "Optional company description",
  "symbol": "ABC"
}
```

Notes:

- `symbol` is uppercased by the backend.
- Password rules are the same as user registration.

#### Login company

- `POST /api/auth-company/login`

Request body:

```json
{
  "email": "company@example.com",
  "password": "StrongPass@123"
}
```

Response includes a JWT token.

#### Logout company

- `POST /api/auth-company/logout`

Headers:

- `Authorization: Bearer <token>`

## Public Routes

### Health check

- `GET /`

Returns:

```json
"Server is running"
```

### Stocks

#### Get all stocks

- `GET /api/stock/all`

Returns:

```json
{
  "success": true,
  "message": "Stocks fetched successfully",
  "data": []
}
```

Each stock record can include fields like `name`, `symbol`, `totalShares`, `issuedShares`, `currentPrice`, `isListed`, `isActive`, and `createdBy`.

### IPOs

#### Get all IPOs

- `GET /api/ipo`

Returns:

```json
{
  "success": true,
  "ipos": []
}
```

#### Get IPO by company symbol

- `GET /api/ipo/:symbol`

Example:

- `GET /api/ipo/ABC`

Returns the latest IPO for the stock symbol.

## User Protected Routes

All routes in this section require:

- `Authorization: Bearer <user-token>`

### User profile

- `GET /api/user/profile`

Returns the user document without the password.

### User orders

- `GET /api/user/orders`

Returns the user’s orders sorted newest first.

### User trades

- `GET /api/user/trades`

Returns trades where the user is either buyer or seller.

### User balance

- `GET /api/user/balance`

Returns the latest available balance from the ledger.

### User portfolio

- `GET /api/user/portfolio`

Returns the user portfolio.

If the user has no portfolio yet, the API returns:

```json
{
  "success": true,
  "portfolio": { "stocks": [] }
}
```

### Add funds

- `POST /api/funds/add`

Request body:

```json
{
  "amount": 10000
}
```

Use this to deposit money into the user ledger before placing buy orders or IPO bids.

### Place buy order

- `POST /api/order/buy`

Request body:

```json
{
  "stockSymbol": "ABC",
  "quantity": 10,
  "price": 100,
  "category": "LIMIT"
}
```

Notes:

- `category` must be `LIMIT` or `MARKET`.
- `stockSymbol` is normalized to uppercase.

### Place sell order

- `POST /api/order/sell`

Request body:

```json
{
  "stockSymbol": "ABC",
  "quantity": 10,
  "price": 100,
  "category": "LIMIT"
}
```

## Company Protected Routes

All routes in this section require:

- `Authorization: Bearer <company-token>`

### Company profile

- `GET /api/company/profile`

Returns:

- company data without password
- company ledger entries

### Company IPOs

- `GET /api/company/ipos`

Returns IPOs created by the company.

### Company trades

- `GET /api/company/trades`

Returns trades associated with the company.

### Company stock details

- `GET /api/company/stock-details`

Returns the stock linked to the company symbol.

### Create stock

- `POST /api/stock/create`

Request body:

```json
{
  "name": "ABC Industries",
  "quantity": 100000
}
```

Notes:

- Symbol comes from the authenticated company record.
- This route creates the stock only if one with the same symbol does not already exist.

### Get stock by symbol

- `GET /api/stock/:symbol`

Example:

- `GET /api/stock/ABC`

This route is protected by company auth.

### Create IPO

- `POST /api/ipo/create`

Request body:

```json
{
  "stockId": "mongo-id-here",
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

Notes:

- The backend also accepts `priceBand` instead of `priceRange`.
- `lotSize` defaults to `1` if omitted in the controller, though the schema default is `10`.
- The stock must exist and must not already be listed.

### Close IPO

- `PATCH /api/ipo/:id/close`

Example:

- `PATCH /api/ipo/66c123.../close`

Use this to manually close an IPO if the scheduler does not do it.

## User IPO Action

### Place IPO bid

- `POST /api/ipo/:id/bid`

Headers:

- `Authorization: Bearer <user-token>`

Request body:

```json
{
  "quantity": 100,
  "bidPrice": 95
}
```

Notes:

- Quantity must be a multiple of the IPO lot size.
- Bid price must stay within the IPO price range.
- The backend checks that the user has enough available balance and locks the bid amount.

## Important Data Shapes

### User

- `email`
- `name`
- `type`
- timestamps

### Company

- `name`
- `symbol`
- `email`
- `description`
- timestamps

### Stock

- `name`
- `symbol`
- `totalShares`
- `issuedShares`
- `currentPrice`
- `isListed`
- `isActive`
- `createdBy`

### IPO

- `stockId`
- `totalShares`
- `priceRange.min`
- `priceRange.max`
- `cutoffPrice`
- `lotSize`
- `soldShares`
- `status`
- `startDate`
- `endDate`
- `createdBy`

### Order

- `userId`
- `symbol`
- `type` as `BUY` or `SELL`
- `category` as `LIMIT` or `MARKET`
- `price`
- `quantity`
- `remainingQty`
- `status`

### Trade

- `buyerId`
- `sellerId`
- `buyOrderId`
- `sellOrderId`
- `bidId`
- `symbol`
- `price`
- `quantity`
- `totalAmount`
- `type` as `SECONDARY` or `IPO`

### Ledger

- `userId` or `companyId`
- `symbol`
- `quantity`
- `price`
- `amount`
- `type`
- `balanceAfter`
- `referenceId`
- `referenceModel`

## Frontend Integration Notes

- Store the JWT after login and attach it to protected requests.
- Use separate auth state for users and companies because the backend has distinct auth routes and middleware.
- For buy/sell and IPO bid flows, refresh balance, portfolio, orders, and trades after a successful mutation.
- If the API returns a 401, clear local auth state and route the user back to login.
