import { Router } from "express";
import { generateTrip, getAllTrips, getTripById } from "../controllers/trip.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/generate-trip", authenticate, generateTrip)
router.get("/all", authenticate, getAllTrips )
router.get("/:tripId", authenticate, getTripById )

export default router;