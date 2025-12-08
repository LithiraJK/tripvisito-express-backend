import bcrypt from "bcryptjs";
import { Role, User } from "../models/user.model";
import { Request, Response } from "express";
import { JWTPayload, signAccessToken, signRefreshToken } from "../utils/jwt.util";
import { sendSuccess, sendError } from "../services/api.response.util";
import { env } from "../config/env";
import { AuthRequest } from "../middlewares/auth.middleware";
import jwt from "jsonwebtoken"
import { IUser} from "../models/user.model";


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


export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email,name, password, profileimg } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      sendError(res, 400, "User already exists with this email");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      name: name,
      password: hashedPassword,
      roles: [Role.USER],
      isBlock: false,
      profileimg: profileimg,
    });

    sendSuccess(res, 201, "User registered successfully", {
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        roles: newUser.roles,
        profileimg: newUser.profileimg,
      }
    });
  } catch (error) {
    sendError(res, 500, "Internal Server Error", error instanceof Error ? error.message : "Unknown error");
  }
};

export const registerAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, name , password, profileimg } = req.body;

    const existsAdmin = await User.findOne({ email });

    if (existsAdmin) {
      sendError(res, 400, "Admin already exists!");
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = await User.create({
      email: email,
      name: name,
      password: hashedPassword,
      roles: [Role.ADMIN],
      isBlock: false,
      profileimg: profileimg,
    });

    const token = signAccessToken(newAdmin);

    sendSuccess(res, 201, "Admin created successfully!", {
      token,
      user: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        roles: newAdmin.roles,
        profileimg: newAdmin.profileimg,
      }
    });
  } catch (error) {
    sendError(res, 500, "Internal Server Error", error instanceof Error ? error.message : "Unknown error");
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email });

    if (!existUser) {
      sendError(res, 401, "Invalid credentials");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password);

    if (!isPasswordValid) {
      sendError(res, 401, "Invalid credentials");
      return;
    }

    const accessToken = signAccessToken(existUser);
    const refreshToken = signRefreshToken(existUser);

    sendSuccess(res, 200, "User logged in successfully", {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: existUser._id,
        email: existUser.email,
        name: existUser.name,
        roles: existUser.roles,
      }
    });
  } catch (error) {
    sendError(res, 500, "Internal Server Error", error instanceof Error ? error.message : "Unknown error");
  }
};


export const getMyProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, "Unauthorized" )
  }
  const user = await User.findById(req.user.sub).select("-password")

  if (!user) {
    return sendError(res, 403, "User not found")
  }

  const { email, roles, name, _id , profileimg } = user as IUser

  sendSuccess(res, 200, "ok", { id: _id, email, name, roles , profileimg })
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1 ;
    const limit = parseInt(req.query.limit as string) || 4;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .populate("email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments()

    sendSuccess(res , 200 , "Users Data fetch successfully !" , {
        users: users,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        page
      } )
    
  } catch (error) {
    console.error("Error retrieving users:", error);
    sendError(res, 500, "Failed to retrieve users");
  }
}


export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" })
    }

    // verify refresh token
    const payload = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRECT
    )

    const userId = (payload as JWTPayload).sub

    const user = await User.findById(userId) as IUser | null
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const newAccessToken = signAccessToken(user)

    sendSuccess(res, 200, "Token refreshed successfully", {
      accessToken: newAccessToken
    })
    
  } catch (error) {
    console.error(error)
    sendError(res, 500, "Invalid refresh token or Expired")
    
  }
}
