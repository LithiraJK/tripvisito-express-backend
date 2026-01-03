import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { sendSuccess, sendError } from "../utils/api.response.util";

export const getChatHistory = async (req: Request, res: Response) => {
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