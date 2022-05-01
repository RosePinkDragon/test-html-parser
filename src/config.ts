import dotenv from 'dotenv';
dotenv.config();

export const PORT: string | number = process.env.PORT || 3000;
export const NODE_ENV: string = process.env.NODE_ENV || 'dev';
export const ORIGIN: string = process.env.ORIGIN;
export const MONGO_URL: string = process.env.MONGO_URL;
export const HEALTH_CHECK = '/hello';
export const AUTH_URL = 'http://localhost:4001';
