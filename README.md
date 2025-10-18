# Moose & Me — Square Custom Cart (Fixed)

This package includes the corrected Square SDK dependency and `.npmrc` to avoid 404s on scoped packages.

## Deploy (Render)
- Root Directory: `server`
- Build: `npm install --omit=dev`
- Start: `node server.js`
- Env vars:
  - `NODE_ENV=production`
  - `SQUARE_ENV=sandbox` (or `production` later)
  - `SQUARE_ACCESS_TOKEN=...`
  - `SQUARE_LOCATION_ID=...`

Generated 2025-10-18.
