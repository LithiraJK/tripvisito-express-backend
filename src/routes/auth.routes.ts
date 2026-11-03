import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  getMyProfile,
  googleLogin,
  loginUser,
  refreshToken,
  registerAdmin,
  registerUser,
  updateUserStatus,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../models/user.model";
import { upload } from "../middlewares/upload.middleware";
import { getLatestUserSignups } from "../controllers/stats.controller";

const router = Router();

// Rate limiting for auth endpoints (SEC-02)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

router.post("/register", authLimiter, registerUser);

router.post("/login", authLimiter, loginUser);

router.post("/google-login", authLimiter, googleLogin);

router.get("/me", authenticate, getMyProfile);

router.post("/refresh", refreshToken);

router.post(
  "/register/admin",
  authenticate,
  requireRole([Role.SUPERADMIN]),
  registerAdmin
);

router.get(
  "/users",
  authenticate,
  requireRole([Role.ADMIN, Role.SUPERADMIN]),
  getAllUsers
);

router.post(
  "/register/new-user",
  authenticate,
  requireRole([Role.ADMIN, Role.SUPERADMIN]),
  upload.single("profileimg"),
  addNewUser
);

router.put(
  "/status/:id",
  authenticate,
  requireRole([Role.ADMIN, Role.SUPERADMIN]),
  updateUserStatus
);

router.delete(
  "/delete/:id",
  authenticate,
  requireRole([Role.ADMIN, Role.SUPERADMIN]),
  deleteUser
);

router.get("/latest-users", authenticate, getLatestUserSignups);

export default router;
