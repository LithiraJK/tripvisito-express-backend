import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { sendSuccess, sendError } from "../utils/api.response.util";
import { AuthRequest } from "../middlewares/auth.middleware";


export const getChatHistory = async (req:AuthRequest, res: Response) => {
    try {
        const { roomId } = req.params;
        
        const history = await Chat.find({ roomId })
            .populate("sender", "name profileimg") 
            .sort({ timeStamp: 1 }); 

        sendSuccess(res, 200, "Chat history retrieved", history);
    } catch (error) {
        sendError(res, 500, "Failed to retrieve chat history");
    }
};

export const getAllChatParticipants = async (req: AuthRequest, res: Response) => {
    try {
        const chatParticipants = await Chat.aggregate([
            {
                $sort: { timeStamp: -1 }
            },
            {
                $group: {
                    _id: "$roomId",
                    lastMessage: { $first: "$message" },
                    lastTimestamp: { $first: "$timeStamp" }
                }
            },
            {
                $lookup: {
                    from: "users", 
                    let: { room_id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$room_id"] } } }
                    ],
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $sort: { lastTimestamp: -1 }
            },
            {
                $project: {
                    _id: 1,
                    name: "$userDetails.name",
                    profileimg: "$userDetails.profileimg",
                    lastMessage: 1,
                    lastTimestamp: 1
                }
            }
        ]);

        sendSuccess(res, 200, "Historical chat users retrieved", chatParticipants);
    } catch (error) {
        console.error("Aggregation Error:", error);
        sendError(res, 500, "Failed to retrieve chat participants");
    }
};