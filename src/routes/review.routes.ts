import { Router } from "express";
import { createReview, getTripReviews } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, createReview);
router.get("/trip/:tripId", getTripReviews);

export default router;