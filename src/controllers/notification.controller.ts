import { Response } from "express";
import { Notification } from "../models/notification.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../utils/api.response.util";

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.sub; 
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        sendSuccess(res, 200, "Notifications retrieved", notifications);
    } catch (error) {
        sendError(res, 500, "Failed to fetch notifications");
    }
};

export const getAllNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        sendSuccess(res, 200, "All notifications retrieved", notifications);
    } catch (error) {
        sendError(res, 500, "Failed to fetch all notifications");
    }
};

// Mark a specific notification as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        sendSuccess(res, 200, "Notification marked as read");
    } catch (error) {
        sendError(res, 500, "Update failed");
    }
};

// Delete a notification 
export const deleteNotification = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        sendSuccess(res, 200, "Notification deleted successfully");
    } catch (error) {
        sendError(res, 500, "Deletion failed");
    }
};