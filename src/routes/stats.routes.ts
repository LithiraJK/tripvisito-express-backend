import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getDashboardStats, getUserGrowth } from "../controllers/stats.controller";

const router = Router();

router.get("/stats", authenticate, getDashboardStats )
router.get("/user-growth", authenticate, getUserGrowth )

export default router;