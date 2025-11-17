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
      firstName: env.SUPERADMIN_FIRST_NAME,
      lastName: env.SUPERADMIN_LAST_NAME,
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
    const { email, firstName, lastName, password, profileimg } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      sendError(res, 400, "User already exists with this email");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      roles: [Role.CUSTOMER],
      isBlock: false,
      profileimg: profileimg,
    });

    const token = signAccessToken(newUser);

    sendSuccess(res, 201, "User registered successfully", {
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
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
    const { email, firstName, lastName, password, profileimg } = req.body;

    const existsAdmin = await User.findOne({ email });

    if (existsAdmin) {
      sendError(res, 400, "Admin already exists!");
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = await User.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
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
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
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
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: existUser._id,
        email: existUser.email,
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        roles: existUser.roles,
      }
    });
  } catch (error) {
    sendError(res, 500, "Internal Server Error", error instanceof Error ? error.message : "Unknown error");
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" })
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

    //send new access token
    res.status(200).json({
      message: "success",
      data: {
        accessToken: newAccessToken
      }
    })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Invalid refresh token or Expired"
    })
    
  }
}
