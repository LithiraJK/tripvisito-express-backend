import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { env } from "../config/env";

// JWT Payload interface for type safety
export interface JWTPayload {
  sub: string;
  roles: string[];
  email: string;
  name: string;
  rememberMe?: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Signs an access token for the given user
 * @param user - User object to generate token for
 * @returns JWT access token string
 */
export const signAccessToken = (user: IUser): string => {
  const payload: JWTPayload = {
    sub: user._id.toString(),
    roles: user.roles,
    email: user.email,
    name: user.name,
  };

  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any,
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Signs a refresh token for the given user
 * @param user - User object
 * @param rememberMe - If true, expires in 7 days (7d); otherwise expires in 1 day (1d)
 * @returns JWT refresh token string
 */
export const signRefreshToken = (user: IUser, rememberMe: boolean = true): string => {
  const payload: any = {
    sub: user._id.toString(),
    rememberMe: Boolean(rememberMe),
  };

  const secret = env.JWT_REFRESH_SECRECT;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRECT is not defined in environment variables");
  }

  // 7 days if Remember Me is checked, otherwise 1 day
  const expiresIn = rememberMe ? "7d" : "1d";

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign(payload, secret, options);
};
