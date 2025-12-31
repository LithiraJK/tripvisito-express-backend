import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Stripe from "stripe";
import { Payment } from "../models/payment.model";
import { env } from "../config/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { tripId, tripName, tripImage, tripDescription, amount } = req.body;
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tripName,
              images: tripImage ? [tripImage] : [],
              description: tripDescription,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.CLIENT_URL}/trip/payment/success`,
      cancel_url: `${env.CLIENT_URL}/trip/${tripId}`,
      metadata: {
        userId: userId.toString(),
        tripId: tripId,
      },
    });

    // 2. අපේ Database එකේ 'PENDING' Payment එකක් නිර්මාණය කිරීම
    await Payment.create({
      tripId: tripId,
      userId: userId,
      amount: amount,
      status: "PENDING",
      isPaid: false,
      stripeSessionId: session.id, // Webhook එකට මේ ID එක ගොඩක් වැදගත්
    });

    // 3. Session URL එක Frontend එකට යැවීම
    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
