import jwt from "jsonwebtoken";
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
    sub: user._id!.toString(),
    roles: user.roles,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return jwt.sign(payload, env.JWT_SECRET, { 
    expiresIn: env.JWT_EXPIRES_IN
  } as jwt.SignOptions);
};
