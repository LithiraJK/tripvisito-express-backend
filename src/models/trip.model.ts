import mongoose, { Document, Schema } from "mongoose"

export interface ITrip extends Document {
    _id: mongoose.Types.ObjectId;
    tripDetails: string;
    imageUrls?: string[];
    paymentLink: string;
    createdAt: Date;
    userId: mongoose.Types.ObjectId;
}

const tripSchema = new Schema({
    tripDetails:{
        type: String,
        required: true
    },
    imageUrls:{
        type: [String],
    },
    paymentLink:{
        type: String
    },
    createdAt:{
        type : Date,
        required : true
    },
    userId:{
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
})

export const Trip = mongoose.model<ITrip>("Trip", tripSchema);