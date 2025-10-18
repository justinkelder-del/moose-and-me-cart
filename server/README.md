# Moose & Me — Square Custom Cart (Server)

Node/Express backend that:
- Lists products from Square **Catalog API**
- Builds Square **Orders** from your on-site cart
- Generates **Payment Links** (Square-hosted checkout) with **Checkout API**
- (Optional) Receives **Webhooks**

## Setup
1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in:
   - `SQUARE_ENV` (sandbox|production)
   - `SQUARE_ACCESS_TOKEN`
   - `SQUARE_LOCATION_ID`
4. `npm run dev` → http://localhost:3000

> The server also serves the frontend at the root for quick local testing.

## Endpoints
- `GET /api/catalog` → Items (merged from Catalog with default variation + price)
- `POST /api/checkout` → Accepts `{ items:[{variationId, name, quantity}] }` and returns `{ checkoutUrl }`
- `POST /api/webhooks/square` → (Optional) webhooks receiver

## Notes
- For price integrity, we pass `catalogObjectId` (variationId) in line items so pricing is sourced from Square Catalog.
- To override prices dynamically (not typical), send `basePriceMoney` per item instead.
- For embedded card entry on your site, swap to **Web Payments SDK** + `paymentsApi.createPayment` instead of hosted payment links.
