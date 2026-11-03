import { Response } from "express";
import mongoose from "mongoose";
import { Notification } from "../models/notification.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../utils/api.response.util";

export const getNotifications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Notifications retrieved", notifications);
  } catch (error) {
    return sendError(res, 500, "Failed to fetch notifications");
  }
};

export const getAllNotifications = async (_req: AuthRequest, res: Response): Promise<any> => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, "All notifications retrieved", notifications);
  } catch (error) {
    return sendError(res, 500, "Failed to fetch all notifications");
  }
};

// Mark a specific notification as read (scoped to current user or admin)
export const markAsRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;

    if (!id || !mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid notification ID");
    }

    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return sendError(res, 404, "Notification not found");
    }

    return sendSuccess(res, 200, "Notification marked as read");
  } catch (error) {
    return sendError(res, 500, "Update failed");
  }
};

// Delete a notification (scoped to current user)
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;

    if (!id || !mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid notification ID");
    }

    const deleted = await Notification.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return sendError(res, 404, "Notification not found");
    }

    return sendSuccess(res, 200, "Notification deleted successfully");
  } catch (error) {
    return sendError(res, 500, "Deletion failed");
  }
};
