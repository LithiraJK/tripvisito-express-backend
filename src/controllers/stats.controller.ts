import { AuthRequest } from "../middlewares/auth.middleware";
import { Trip } from "../models/trip.model";
import { User } from "../models/user.model";
import { Response } from "express";
import { sendError, sendSuccess } from "../utils/api.response.util";
import { send } from "process";
import { Payment } from "../models/payment.model";

// Dashboard Stats
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Helper function for trend aggregation
    const getTrendData = async (Model: any, dateField: string) => {
      const result = await Model.aggregate([
        { $match: { [dateField]: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return result.map((item: any) => item.count);
    };

    const [
      totalUsers,
      totalTrips,
      activeThisMonth,
      activeLastMonth,
      usersThisMonth,
      tripsThisMonth,
      usersLastMonth,
      tripsLastMonth,
      userTrend,
      tripTrend,
      activeTrend,
    ] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: startOfCurrentMonth } }),
      User.countDocuments({
        lastLogin: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
      }),
      User.countDocuments({ joinedAt: { $gte: startOfCurrentMonth } }),
      Trip.countDocuments({ createdAt: { $gte: startOfCurrentMonth } }),
      User.countDocuments({
        joinedAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
      }),
      Trip.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
      }),
      getTrendData(User, "joinedAt"), // User growth trend
      getTrendData(Trip, "createdAt"), // Trip creation trend
      getTrendData(User, "lastLogin"), // Active activity trend
    ]);

    sendSuccess(res, 200, "Dashboard stats fetched successfully", {
      users: {
        total: totalUsers,
        currentMonth: usersThisMonth,
        lastMonth: usersLastMonth,
        trend: userTrend || [],
      },
      trips: {
        total: totalTrips,
        currentMonth: tripsThisMonth,
        lastMonth: tripsLastMonth,
        trend: tripTrend || [],
      },
      active: {
        total: activeThisMonth,
        currentMonth: activeThisMonth,
        lastMonth: activeLastMonth,
        trend: activeTrend || [],
      },
    });
  } catch (error) {
    sendError(res, 500, "Failed to fetch dashboard stats");
  }
};

// User Growth Chart
export const getUserGrowth = async (req: AuthRequest, res: Response) => {
  try {
    const growth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$joinedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    sendSuccess(res, 200, "User growth data fetched successfully", growth);
  } catch (error) {
    sendError(res, 500, "Failed to fetch user growth data");
  }
};

export const getTripsByTravelStyle = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const trends = await Trip.aggregate([
      {
        $match: {
          tripDetails: { $exists: true, $type: "string", $ne: "" },
        },
      },
      {
        $project: {
          details: { $jsonParse: "$tripDetails" },
        },
      },
      {
        $group: {
          _id: { $toLower: "$details.travelStyle" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          style: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      status: 200,
      data: trends,
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    res.status(500).json({ message: "Error fetching trip trends", error });
  }
};

export const getLatestUserSignups = async (req: AuthRequest, res: Response) => {
  try {
    const latestUsers = await User.find()
      .select("name email isBlock profileimg joinedAt")
      .sort({ joinedAt: -1 })
      .limit(5);

    sendSuccess(res, 200, "Latest users fetched successfully", latestUsers);
  } catch (error: any) {
    sendError(res, 500, "Failed to fetch latest user signups");
  }
};

export const getLatestPayments = async (req: AuthRequest, res: Response) => {
  try {
    const latestPayments = await Payment.find()
      .populate("userId", "name email profileimg")
      .populate("tripId", "tripDetails")
      .sort({ createdAt: -1 })
      .limit(5);

    sendSuccess(
      res,
      200,
      "Latest payments fetched successfully",
      latestPayments,
    );
  } catch (error: any) {
    sendError(res, 500, "Failed to fetch latest payments");
  }
};
