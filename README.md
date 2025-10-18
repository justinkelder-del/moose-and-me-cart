# Moose & Me — Square Custom Cart (Full Stack)

This starter implements a **custom on-site cart** powered by **Square APIs**:

- **Frontend** (vanilla JS): product grid, localStorage cart, checkout button.
- **Backend** (Node/Express): pulls **Catalog**, builds an **Order**, creates a **Payment Link** via **Checkout API**.
- Optional: swap to **Web Payments SDK** for embedded card entry.

## Quick Start (Sandbox)
1. Install Node 18+
2. In **Square Developer Dashboard**, create an app and get:
   - Sandbox Access Token
   - Location ID (for your sandbox location)
3. `cd server && npm install`
4. Copy `.env.example` → `.env` and set:

   ```env
   SQUARE_ENV=sandbox
   SQUARE_ACCESS_TOKEN=YOUR_SANDBOX_TOKEN
   SQUARE_LOCATION_ID=YOUR_SANDBOX_LOCATION_ID
   PORT=3000
   ```
5. In Square Dashboard, create a few **Catalog Items** with **Variations** (and prices).
6. `npm run dev` and open http://localhost:3000
7. Add items to cart → Checkout → You'll be redirected to a **Square-hosted checkout** for payment.

## Production
- Flip `SQUARE_ENV=production` and set a **Production Access Token** + **Production Location ID**.
- Host on a server (Railway, Render, Fly, AWS, etc.).
- Configure Square **Webhooks** (optional) to mark orders as fulfilled.

## Where to edit
- **Frontend** (`/frontend`): `index.html`, `cart.html`, `app.js`, `styles.css`
- **Server** (`/server`): `src/routes/catalog.js`, `src/routes/checkout.js`

## Want embedded card entry (no redirect)?
Use **Web Payments SDK**:

- On the frontend, render the card element with Square's script and tokenize the payment method.

- On the backend, call `paymentsApi.createPayment` with the token + constructed order.

I can add that variant if you want an in-page checkout flow.

---

_Generated 2025-10-18_
