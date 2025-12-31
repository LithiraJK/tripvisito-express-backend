import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    tripId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    paymentDate?: Date;
    status: "CONFIRMED" | "CANCELLED" | "PENDING";
    isPaid: boolean;
    stripeSessionId?: string;    // To find the booking during webhook
    paymentIntentId?: string;    // For refunds or tracking in Stripe dashboard
    amount: number;
}

const paymentSchema = new Schema({
    tripId: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["CONFIRMED", "CANCELLED", "PENDING"],
        default: "PENDING",
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false,
        required: true
    },
    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true  
    },
    paymentIntentId: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);