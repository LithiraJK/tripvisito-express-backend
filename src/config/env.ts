import { config } from "dotenv";
config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_ROUNDS: number;
  CORS_ORIGIN: string;
  SUPERADMIN_EMAIL: string;
  SUPERADMIN_PASSWORD: string;
  SUPERADMIN_FIRST_NAME: string;
  SUPERADMIN_LAST_NAME: string;
}

export const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  HOST: process.env.HOST || "localhost",
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL || "",
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD || "",
  SUPERADMIN_FIRST_NAME: process.env.SUPERADMIN_FIRST_NAME || "Super",
  SUPERADMIN_LAST_NAME: process.env.SUPERADMIN_LAST_NAME || "Admin"
};

// Validate required env vars on startup
const requiredEnvVars: (keyof EnvConfig)[] = ["MONGODB_URI", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
