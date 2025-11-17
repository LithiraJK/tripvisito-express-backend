import mongoose, { Document } from "mongoose";

export enum Role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: Role[];
  isBlock: boolean;
  profileimg?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
    enum: Object.values(Role),
    default: [Role.CUSTOMER],
  },
  isBlock: {
    type: Boolean,
    required: true,
    default: false,
  },
  profileimg: {
    type: String,
    required: false,
    default:
      "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1339.jpg?semt=ais_hybrid&w=740&q=80",
  }

},{ timestamps: true });

export const User = mongoose.model<IUser>("User" , userSchema);
