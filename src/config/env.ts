import { config } from "dotenv";
config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRECT: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_ROUNDS: number;
  CORS_ORIGIN: string;
  SUPERADMIN_EMAIL: string;
  SUPERADMIN_PASSWORD: string;
  SUPERADMIN_NAME: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SCRET: string;
  GEMINI_API_KEY: string;
  UNSPLASH_ACCESS_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  CLIENT_URL: string;
}

export const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  HOST: process.env.HOST || "localhost",
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-key",
  JWT_REFRESH_SECRECT: process.env.JWT_REFRESH_SECRECT || "fallback-refresh-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL || "",
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD || "",
  SUPERADMIN_NAME: process.env.SUPERADMIN_NAME || "Super Admin",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SCRET: process.env.CLOUDINARY_API_SCRET || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  CLIENT_URL: process.env.CLIENT_URL || ""
};

// Validate required env vars on startup
const requiredEnvVars: (keyof EnvConfig)[] = ["MONGODB_URI", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
