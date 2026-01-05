import { Router } from "express";
import { createReview, getAllReviews, getTripReviews } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/submit", authenticate, createReview);
router.get("/trip/:tripId", getTripReviews);
router.get("/", getAllReviews);

export default router;