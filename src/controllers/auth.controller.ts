import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { AuthProvider, Role, User } from "../models/user.model";
import { Request, Response } from "express";
import {
  JWTPayload,
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt.util";
import { sendSuccess, sendError } from "../utils/api.response.util";
import { env } from "../config/env";
import { AuthRequest } from "../middlewares/auth.middleware";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import cloudinary from "../config/cloudinary";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createSuperAdmin = async () => {
  try {
    const existsSuperAdmin = await User.findOne({ roles: [Role.SUPERADMIN] });
    if (existsSuperAdmin) {
      return console.log("Super Admin Already Exists");
    }

    const hashedPassword = bcrypt.hashSync(env.SUPERADMIN_PASSWORD, 10);

    await User.create({
      email: env.SUPERADMIN_EMAIL,
      name: env.SUPERADMIN_NAME,
      password: hashedPassword,
      roles: [Role.SUPERADMIN],
      isBlock: false,
      profileimg: "",
    });

    console.log("Super admin account created!");
  } catch (error) {
    console.log("Error creating super admin");
  }
};

export const addNewUser = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { email, name, password, roles } = req.body;
    let imageURL = "";

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return sendError(res, 400, "Please provide a valid email address");
    }
    if (!name || name.trim().length < 2) {
      return sendError(res, 400, "Name must be at least 2 characters long");
    }
    if (!password || password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters long");
    }

    const existUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existUser) {
      return sendError(res, 400, "User already exists with this email");
    }

    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        upload_stream.end(req.file!.buffer);
      });
      imageURL = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userRoles: Role[];
    if (typeof roles === "string") {
      try {
        const parsed = JSON.parse(roles);
        userRoles = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        userRoles = [roles as Role];
      }
    } else if (Array.isArray(roles)) {
      userRoles = roles;
    } else {
      userRoles = [roles as Role || Role.USER];
    }

    const newUser = await User.create({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      roles: userRoles,
      isBlock: false,
      profileimg: imageURL,
    });

    return sendSuccess(res, 201, "User added successfully", {
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles,
        profileimg: newUser.profileimg,
      },
    });
  } catch (error) {
    console.error("Error in addNewUser:", error);
    return sendError(
      res,
      500,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, name, password, profileimg } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return sendError(res, 400, "Please provide a valid email address");
    }
    if (!name || name.trim().length < 2) {
      return sendError(res, 400, "Name must be at least 2 characters long");
    }
    if (!password || password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters long");
    }

    const existUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existUser) {
      return sendError(res, 400, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      roles: [Role.USER],
      isBlock: false,
      profileimg: profileimg || undefined,
    });

    return sendSuccess(res, 201, "User registered successfully", {
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles,
        profileimg: newUser.profileimg,
      },
    });
  } catch (error) {
    return sendError(
      res,
      500,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const registerAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { email, name, password, profileimg } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return sendError(res, 400, "Please provide a valid email address");
    }
    if (!password || password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters long");
    }

    const existsAdmin = await User.findOne({ email: email.trim().toLowerCase() });

    if (existsAdmin) {
      return sendError(res, 400, "Admin already exists with this email!");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = await User.create({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      roles: [Role.ADMIN],
      isBlock: false,
      profileimg: profileimg || undefined,
    });

    const token = signAccessToken(newAdmin);

    return sendSuccess(res, 201, "Admin created successfully!", {
      token,
      user: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        roles: newAdmin.roles,
        profileimg: newAdmin.profileimg,
      },
    });
  } catch (error) {
    return sendError(
      res,
      500,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password");
    }

    const existUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (!existUser) {
      return sendError(res, 401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password || "");

    if (!isPasswordValid) {
      return sendError(res, 401, "Invalid credentials");
    }

    if (existUser.isBlock) {
      return sendError(res, 403, "User account is blocked. Please contact support.");
    }

    // SECURITY RESTRICTION: Block administrative accounts from public login
    const isAdminAccount =
      existUser.roles.includes(Role.ADMIN) ||
      existUser.roles.includes(Role.SUPERADMIN);

    if (isAdminAccount) {
      return sendError(
        res,
        403,
        "Access Denied: Administrative accounts cannot log in via the public portal. Please use the Staff & Admin Portal."
      );
    }

    existUser.lastLogin = new Date();
    await existUser.save();

    const isRemember = Boolean(rememberMe);
    const accessToken = signAccessToken(existUser);
    const refreshToken = signRefreshToken(existUser, isRemember);
    const expiresInMs = isRemember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

    return sendSuccess(res, 200, "User logged in successfully", {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
      rememberMe: isRemember,
      user: {
        id: existUser._id,
        email: existUser.email,
        name: existUser.name,
        roles: existUser.roles,
        profileimg: existUser.profileimg,
      },
    });
  } catch (error) {
    return sendError(
      res,
      500,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide administrative email and password");
    }

    const existUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (!existUser) {
      return sendError(res, 401, "Invalid administrative credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password || "");

    if (!isPasswordValid) {
      return sendError(res, 401, "Invalid administrative credentials");
    }

    // STRICT PRIVILEGE CHECK: Must have ADMIN or SUPERADMIN role
    const hasAdminPrivilege =
      existUser.roles.includes(Role.ADMIN) ||
      existUser.roles.includes(Role.SUPERADMIN);

    if (!hasAdminPrivilege) {
      return sendError(
        res,
        403,
        "Access Denied: This portal is restricted to authorized Administrators only."
      );
    }

    if (existUser.isBlock) {
      return sendError(
        res,
        403,
        "Admin account is deactivated. Please contact Superadmin."
      );
    }

    existUser.lastLogin = new Date();
    await existUser.save();

    const isRemember = Boolean(rememberMe);
    const accessToken = signAccessToken(existUser);
    const refreshToken = signRefreshToken(existUser, isRemember);
    const expiresInMs = isRemember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

    return sendSuccess(res, 200, "Administrative authentication successful", {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
      rememberMe: isRemember,
      user: {
        id: existUser._id,
        email: existUser.email,
        name: existUser.name,
        roles: existUser.roles,
        profileimg: existUser.profileimg,
      },
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return sendError(
      res,
      500,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, name, profileimg } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return sendError(res, 400, "Valid email is required for Google login");
    }

    let user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      // SECURITY RESTRICTION: Block administrative accounts from public Google login
      const isAdminAccount =
        user.roles.includes(Role.ADMIN) ||
        user.roles.includes(Role.SUPERADMIN);

      if (isAdminAccount) {
        return sendError(
          res,
          403,
          "Access Denied: Administrative accounts cannot authenticate via public Google login. Please use the Staff & Admin Portal."
        );
      }

      // Check block status before performing updates
      if (user.isBlock) {
        return sendError(res, 403, "User account is blocked. Please contact support.");
      }
      user.name = name || user.name;
      if (profileimg) user.profileimg = profileimg;
      user.authProvider = AuthProvider.GOOGLE;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        email: email.trim().toLowerCase(),
        name: name || "Google User",
        profileimg: profileimg || undefined,
        roles: [Role.USER],
        authProvider: AuthProvider.GOOGLE,
        isBlock: false,
        lastLogin: new Date(),
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, true);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return sendSuccess(res, 200, "Google login successful", {
      accessToken,
      refreshToken,
      expiresAt,
      rememberMe: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        profileimg: user.profileimg,
      },
    });
  } catch (error) {
    console.error("Error in googleLogin:", error);
    return sendError(res, 500, "Google authentication failed", error instanceof Error ? error.message : "");
  }
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, "Unauthorized");
  }
  const user = await User.findById(req.user.sub).select("-password");

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  const { email, roles, name, _id, profileimg } = user as IUser;

  return sendSuccess(res, 200, "ok", { id: _id, email, name, roles, profileimg });
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 4, 1), 50);
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return sendSuccess(res, 200, "Users Data fetch successfully !", {
      users: users,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return sendError(res, 500, "Failed to retrieve users");
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 401, "Refresh token is required");
    }

    // verify refresh token
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRECT) as any;

    const userId = payload.sub;
    const isRemember = payload.rememberMe ?? true;

    const user = (await User.findById(userId)) as IUser | null;
    if (!user) {
      return sendError(res, 401, "User not found or unauthorized");
    }

    if (user.isBlock) {
      return sendError(res, 403, "User account is blocked");
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user, isRemember);
    const expiresInMs = isRemember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs).toISOString();

    return sendSuccess(res, 200, "Token refreshed successfully", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: expiresAt,
      rememberMe: isRemember,
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Refresh token expired. Please login again.");
    }
    return sendError(res, 401, "Invalid refresh token");
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const { isBlock } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return sendError(res, 400, "Invalid User ID format");
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.roles.includes(Role.SUPERADMIN)) {
      return sendError(res, 403, "Cannot change status of Super Admin");
    }

    user.isBlock = Boolean(isBlock);
    await user.save();
    return sendSuccess(res, 200, "User status updated successfully", { user });
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return sendError(
      res,
      500,
      "Failed to update user status",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return sendError(res, 400, "Invalid User ID format");
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.roles.includes(Role.SUPERADMIN)) {
      return sendError(res, 403, "Cannot delete Super Admin users");
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    return sendSuccess(res, 200, "User deleted successfully", { user: deletedUser });
  } catch (error) {
    return sendError(
      res,
      500,
      "Failed to delete user",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
