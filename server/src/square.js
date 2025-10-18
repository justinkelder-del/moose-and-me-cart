import dotenv from 'dotenv';
import Square from 'square';              // ✅ fixed import for CommonJS module
const { Client, Environment } = Square;   // ✅ destructure from default export

dotenv.config();

const env =
  (process.env.SQUARE_ENV || 'sandbox').toLowerCase() === 'production'
    ? Environment.Production
    : Environment.Sandbox;

export const square = new Client({
  environment: env,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
