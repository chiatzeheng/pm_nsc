import type { innerStatisticType } from "@/context";
import mongoose from "mongoose";
export interface IUser {
  _id: string;
  email: string;
  school: string;
  name: string;
  avatar?: string;
  score: number;
  password: string;
  isEmailVerified: boolean;
  role: "student" | "admin" | "superadmin";
  statistics: {
    Operations: innerStatisticType;
    Selection: innerStatisticType;
    Repetition: innerStatisticType;
    Arrays: innerStatisticType;
    Functions: innerStatisticType;
  };
  announcements_count: number;
  resources_count: number;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true },
    school: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    score: Number,
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "superadmin"],
      default: "student",
    },
    announcements_count: {
      type: Number,
      default: 0,
    },
    resources_count: {
      type: Number,
      default: 0,
    },
    statistics: {
      Operations: {
        total: Number,
        total_correct: Number,
        total_wrong: Number,
      },
      Selection: {
        total: Number,
        total_correct: Number,
        total_wrong: Number,
      },
      Repetition: {
        total: Number,
        total_correct: Number,
        total_wrong: Number,
      },
      Arrays: {
        total: Number,
        total_correct: Number,
        total_wrong: Number,
      },
      Functions: {
        total: Number,
        total_correct: Number,
        total_wrong: Number,
      },
    },
  },

  { timestamps: true }
);
const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);
export default User;
