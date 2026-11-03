import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware";
import Stripe from "stripe";
import { Payment } from "../models/payment.model";
import { env } from "../config/env";
import { sendError, sendSuccess } from "../utils/api.response.util";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { tripId, tripName, tripImage, tripDescription, amount } = req.body;

    const userId = req.user?.sub;
    const userName = req.user?.name || "Customer";

    if (!userId) {
      return sendError(res, 401, "User not authenticated");
    }

    if (!tripId || !mongoose.isValidObjectId(tripId)) {
      return sendError(res, 400, "A valid Trip ID is required");
    }

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return sendError(res, 400, "Payment amount must be greater than zero");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tripName || "Trip Booking",
              images: tripImage ? [tripImage] : [],
              description: tripDescription || "Travel booking via Tripvisito",
            },
            unit_amount: Math.round(parsedAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.CLIENT_URL}/trip/payment/success`,
      cancel_url: `${env.CLIENT_URL}/trip/${tripId}`,
      metadata: {
        userId: userId.toString(),
        userName: userName,
        tripId: tripId.toString(),
        tripName: tripName || "Trip Booking",
      },
    });

    await Payment.create({
      tripId: tripId,
      userId: userId,
      amount: parsedAmount,
      status: "PENDING",
      isPaid: false,
      stripeSessionId: session.id,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    return sendError(res, 500, "Failed to create payment session", error.message);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return sendError(res, 401, "User not authenticated");
    }

    // Fetch payments and 'populate' the trip information
    const bookings = await Payment.find({ userId })
      .populate({
        path: "tripId",
        select: "tripDetails imageUrls",
      })
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "User bookings retrieved", bookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return sendError(res, 500, "Failed to fetch your bookings");
  }
};
