import { Router } from "express";
import { generateTrip } from "../controllers/trip.controller";

const router = Router();

router.post("/generate-trip", generateTrip)

export default router;