import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
    _id: mongoose.Types.ObjectId;
    roomId: string;
    sender: mongoose.Types.ObjectId;
    message: string;
    timeStamp: Date;
}

const chatSchema = new Schema<IChat>({
    roomId: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type : String,
        required : true
    },
    timeStamp:{
        type: Date,
        required: true,
        default: Date.now
    }
})

export const Chat = mongoose.model<IChat>("Chat", chatSchema);