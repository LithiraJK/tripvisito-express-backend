import { Router } from "express";
import { generateTrip } from "../controllers/trip.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/generate-trip", authenticate, generateTrip)

export default router;