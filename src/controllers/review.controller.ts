import { Response } from "express";
import { Review } from "../models/review.model";
import { Payment } from "../models/payment.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../utils/api.response.util";

export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { tripId, rating, comment } = req.body;
        const userId = req.user?.sub;

        const hasPaid = await Payment.findOne({ userId, tripId, status: "CONFIRMED" });
        if (!hasPaid) {
            return sendError(res, 403, "You can only review trips you have paid for.");
        }

        const newReview = await Review.create({ userId, tripId, rating, comment });
        
        sendSuccess(res, 201, "Review submitted successfully", newReview);
    } catch (error) {
        sendError(res, 500, "Failed to submit review");
    }
};

export const getTripReviews = async (req: AuthRequest, res: Response) => {
    try {
        const { tripId } = req.params;
        const reviews = await Review.find({ tripId }).populate("userId", "name profileimg");
        sendSuccess(res, 200, "Reviews retrieved", reviews);
    } catch (error) {
        sendError(res, 500, "Failed to fetch reviews");
    }
};