import mongoose, { Document, Schema } from "mongoose"

export interface ITrip extends Document {
    _id: mongoose.Types.ObjectId;
    tripDetails: string;
    imageUrl?: string;
    paymentLink: string;
    createdAt: Date;
    userId: mongoose.Types.ObjectId;
}

const tripSchema = new Schema({
    tripDetails:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String
    },
    paymentLink:{
        type: String,
        required: true
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