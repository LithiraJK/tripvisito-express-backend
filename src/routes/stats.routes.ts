import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getDashboardStats, getLatestUserSignups, getTripsByTravelStyle, getUserGrowth } from "../controllers/stats.controller";

const router = Router();

router.get("/stats", authenticate, getDashboardStats )
router.get("/user-growth", authenticate, getUserGrowth )
router.get("/trips-by-travel-style", authenticate, getTripsByTravelStyle)

export default router;