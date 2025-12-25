import { Router } from "express";
import { generateTrip, getAllTrips, getTripById, updateTrip, getTripsByUser } from "../controllers/trip.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/generate-trip", authenticate, generateTrip)
router.get("/all", authenticate, getAllTrips )
router.get("/user-trips", authenticate, getTripsByUser )
router.get("/:tripId", authenticate, getTripById )
router.put("/:tripId", authenticate, updateTrip )

export default router;