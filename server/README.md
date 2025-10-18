# Moose & Me — Square Custom Cart (Server)

- Lists products from **Catalog API**
- Builds an **Order**
- Creates **Payment Links** (hosted checkout)
- Optional **webhooks**

## Setup
1. `cd server && npm install`
2. Copy `.env.example` → `.env` and fill:
   - `SQUARE_ENV` (sandbox|production)
   - `SQUARE_ACCESS_TOKEN`
   - `SQUARE_LOCATION_ID`
3. `npm run dev` → http://localhost:3000

## Endpoints
- `GET /api/health`
- `GET /api/catalog`
- `POST /api/checkout`
