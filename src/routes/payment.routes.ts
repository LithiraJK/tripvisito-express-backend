import { Router } from "express";
import { createCheckoutSession, getMyBookings } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkout", authenticate, createCheckoutSession);
router.get("/my-bookings", authenticate, getMyBookings);

export default router;