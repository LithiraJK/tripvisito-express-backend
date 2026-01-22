import { Router } from "express";
import { createCheckoutSession, getMyBookings } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { getLatestPayments } from "../controllers/stats.controller";

const router = Router();

router.post("/checkout", authenticate, createCheckoutSession);
router.get("/my-bookings", authenticate, getMyBookings);
router.get("/latest" , authenticate, getLatestPayments);

export default router;