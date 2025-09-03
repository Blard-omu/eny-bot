import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = 'admin',
  SUPERADMIN = 'super_admin',
  USER = 'user',
}

export interface IUser extends Document {
  username: string;
  email: string;
  phone?: string;
  password?: string;
  role: Role;
  profileImage?: string;
}

const userSchema = new Schema<IUser>(
  {
    
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Invalid email format",
      ],
    },
    phone: { type: String, trim: true, default: "+123456789"},
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: 64,
      select: false,
    },
    profileImage: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
export { Role as UserRole };
