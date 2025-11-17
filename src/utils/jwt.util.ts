import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { env } from "../config/env";

// JWT Payload interface for type safety
export interface JWTPayload {
  sub: string;
  roles: string[];
  email: string;
  firstName: string;
  lastName: string;
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
    firstName: user.firstName,
    lastName: user.lastName,
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

export const signRefreshToken = (user: IUser): string => {
  const payload: any = {
    sub: user._id.toString(),
  };

  const secret = env.JWT_REFRESH_SECRECT;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRECT is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  };

  return jwt.sign(payload, secret, options);
};
