import dotenv from 'dotenv';
import { Client, Environment } from '@square/square';

dotenv.config();

// Validate required env vars
['SQUARE_ACCESS_TOKEN','SQUARE_LOCATION_ID','SQUARE_ENV'].forEach((k)=>{
  if(!process.env[k]) {
    console.warn(`[WARN] Missing ${k} in environment. See .env.example.`);
  }
});

const env = (process.env.SQUARE_ENV || 'sandbox').toLowerCase() === 'production'
  ? Environment.Production
  : Environment.Sandbox;

export const square = new Client({
  environment: env,
  accessToken: process.env.SQUARE_ACCESS_TOKEN
});

export const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
