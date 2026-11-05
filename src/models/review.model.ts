import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, minlength: 2, maxlength: 1000 },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from the same user for the same trip (LOG-08)
ReviewSchema.index({ userId: 1, tripId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
