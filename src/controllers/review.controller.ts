import mongoose from "mongoose";
import { Review } from "../models/review.model";
import { Payment } from "../models/payment.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../utils/api.response.util";
import { Request, Response } from "express";

export const createReview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { tripId, rating, comment } = req.body;
    const userId = req.user?.sub;

    if (!userId) {
      return sendError(res, 401, "User not authenticated");
    }

    if (!tripId || !mongoose.isValidObjectId(tripId)) {
      return sendError(res, 400, "Valid tripId is required");
    }

    const numRating = Number(rating);
    if (!numRating || isNaN(numRating) || numRating < 1 || numRating > 5) {
      return sendError(res, 400, "Rating must be between 1 and 5");
    }

    const trimmedComment = typeof comment === "string" ? comment.trim() : "";
    if (!trimmedComment || trimmedComment.length < 2) {
      return sendError(res, 400, "Comment must be at least 2 characters long");
    }

    // Check if user has paid for this trip
    const hasPaid = await Payment.findOne({
      userId,
      tripId,
      status: "CONFIRMED",
    });

    if (!hasPaid) {
      return sendError(res, 403, "You can only review trips you have paid for.");
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ userId, tripId });
    if (existingReview) {
      return sendError(res, 409, "You have already reviewed this trip.");
    }

    const newReview = await Review.create({
      userId,
      tripId,
      rating: numRating,
      comment: trimmedComment,
    });

    return sendSuccess(res, 201, "Review submitted successfully", newReview);
  } catch (error: any) {
    if (error.code === 11000) {
      return sendError(res, 409, "You have already reviewed this trip.");
    }
    return sendError(res, 500, "Failed to submit review");
  }
};

export const getTripReviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const { tripId } = req.params;

    if (!tripId || !mongoose.isValidObjectId(tripId)) {
      return sendError(res, 400, "Valid tripId is required");
    }

    const reviews = await Review.find({ tripId })
      .populate("userId", "name profileimg")
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Reviews retrieved", reviews);
  } catch (error) {
    return sendError(res, 500, "Failed to fetch reviews");
  }
};

export const getAllReviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate("userId", "name profileimg")
      .populate("tripId", "tripDetails.name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments();
    const totalPages = Math.ceil(totalReviews / limit);

    return sendSuccess(res, 200, "Reviews retrieved", {
      reviews,
      pagination: {
        totalReviews,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Fetch All Reviews Error:", error);
    return sendError(res, 500, "Failed to fetch reviews");
  }
};
