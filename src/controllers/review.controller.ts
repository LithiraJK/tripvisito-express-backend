import { Review } from "../models/review.model";
import { Payment } from "../models/payment.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../utils/api.response.util";
import { Request, Response } from "express";

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

export const getAllReviews = async (req: Request, res: Response) => {
    try {
        // 1. Get pagination parameters from query string (default to page 1, limit 10)
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // 2. Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // 3. Fetch reviews with population and pagination
        const reviews = await Review.find()
            .populate("userId", "name profileimg") // Get reviewer details
            .populate("tripId", "tripDetails.name") // Get trip name
            .sort({ createdAt: -1 }) // Show newest first
            .skip(skip)
            .limit(limit);

        // 4. Get total count for frontend pagination UI
        const totalReviews = await Review.countDocuments();
        const totalPages = Math.ceil(totalReviews / limit);

        sendSuccess(res, 200, "Reviews retrieved", {
            reviews,
            pagination: {
                totalReviews,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Fetch All Reviews Error:", error);
        sendError(res, 500, "Failed to fetch reviews");
    }
};