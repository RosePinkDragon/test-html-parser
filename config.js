import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "dev";
export const ORIGIN = process.env.ORIGIN;
export const MONGO_URL = process.env.MONGO_URL;
export const HEALTH_CHECK = "/hello";
export const AUTH_URL = "http://localhost:3005";
