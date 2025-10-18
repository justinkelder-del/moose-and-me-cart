// /server/src/square.js
import dotenv from 'dotenv';
import { Client, Environment } from 'square/legacy'; // ← legacy shim restores Client/Environment
dotenv.config();

// Helpful warnings if env vars are missing
['SQUARE_ACCESS_TOKEN', 'SQUARE_LOCATION_ID', 'SQUARE_ENV'].forEach((k) => {
  if (!process.env[k]) {
    console.warn(`[WARN] Missing ${k} in environment. Check your Render env vars.`);
  }
});

const envName = (process.env.SQUARE_ENV || 'sandbox').toLowerCase();
const env =
  envName === 'production' ? Environment.Production : Environment.Sandbox;

export const square = new Client({
  // v40+ requires bearerAuthCredentials in the legacy surface
  bearerAuthCredentials: { accessToken: process.env.SQUARE_ACCESS_TOKEN },
  environment: env,
});

// Used by your checkout route to build orders
export const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
