import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JWTPayload } from "../utils/jwt.util";
import { sendError } from "../services/api.response.util";

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(res, 401, "Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    req.user = payload;
    next();
  } catch (error: any) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Access Token Expired");
    }

    return sendError(res, 401, "Invalid Access Token");
  }
};
