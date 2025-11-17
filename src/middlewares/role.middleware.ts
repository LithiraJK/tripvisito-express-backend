import { Response, NextFunction } from "express";
import { Role } from "../models/user.model";
import { AuthRequest } from "./auth.middleware";
import { sendError } from "../services/api.response.util";

export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized: No user information found");
    }

    const hasRequiredRole = roles.some((role) =>
      req.user?.roles?.includes(role)
    );

    if (!hasRequiredRole) {
      return sendError(res, 403, "Access Forbidden");
    }

    next();
  };
};
