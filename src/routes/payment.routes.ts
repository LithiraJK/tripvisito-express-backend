import { Router } from "express";
import { createCheckoutSession } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkout", authenticate, createCheckoutSession);

export default router;