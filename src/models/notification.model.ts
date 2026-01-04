import mongoose, { Schema, Document } from "mongoose";
export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: "INFO" | "PAYMENT" | "CHAT";
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["INFO", "PAYMENT", "CHAT"], default: "INFO" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);