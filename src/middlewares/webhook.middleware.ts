import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Payment } from '../models/payment.model';
import { env } from '../config/env';
import { sendEmail } from '../services/mail.service'; 
import { bookingSuccessTemplate } from '../utils/email.template'; 

const stripe = new Stripe(env.STRIPE_SECRET_KEY!);

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {

            await Payment.findOneAndUpdate(
                { stripeSessionId: session.id },
                {
                    status: "CONFIRMED",
                    isPaid: true,
                    paymentDate: new Date(),
                    paymentIntentId: session.payment_intent as string
                }
            );
            console.log("Payment updated in DB for session:", session.id);

            const userEmail = session.customer_details?.email;
            const userName = session.metadata?.userName || "Traveler";
            const tripName = session.metadata?.tripName || "your adventure";
            const amount = (session.amount_total || 0) / 100;

            // 3. Trigger Email Notification (Asynchronous)
            if (userEmail) {
                const htmlContent = bookingSuccessTemplate(userName, tripName, amount);
                
                sendEmail(userEmail, `Booking Confirmed: ${tripName}`, htmlContent)
                    .then(() => console.log(`Confirmation email sent to ${userEmail}`))
                    .catch((err) => console.error("Email Service Failure:", err));
            }

        } catch (dbErr) {
            console.error("DB Update Error:", dbErr);
            return res.status(500).json({ message: "DB Update Failed" });
        }
    }

    res.status(200).json({ received: true });
};