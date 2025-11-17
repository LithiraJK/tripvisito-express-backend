import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JWTPayload } from "../utils/jwt.util";
import { sendError } from "../services/api.response.util";

export interface AuthRequest extends Request {
  // extend Request to include user property
  user?: JWTPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization; // get full Authorization header

  if (!authHeader) {
    return sendError(res, 401, "Unauthorized : No token provided !");
  }

  const token = authHeader.split(" ")[1]; // split token seperated by space -> Bearer_Token

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    req.user = payload; // attach user payload to request
    next();
  } catch (error) {
    console.log(error);
    return sendError(res, 403, "Access Denied: Invalid Token");
  }
};
