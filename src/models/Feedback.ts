import type { innerStatisticType } from "@/context";
import mongoose from "mongoose";

export interface IFeedback {
  _id: string;
  userId: mongoose.Schema.Types.ObjectId;
  category: "Bug Report" | "Feature Request" | "Other";
  subject: string;
  comment: string;
  archived:boolean;
}

const feedbackSchema = new mongoose.Schema<IFeedback>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: {
      type: String,
      enum: ["Bug Report", "Feature Request", "Other"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 50,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
    archived:{
      type:Boolean,
      required:true,
    },
  },

  { timestamps: true }
);
const Feedback =
  (mongoose.models.Feedback as mongoose.Model<IFeedback>) ||
  mongoose.model<IFeedback>("Feedback", feedbackSchema);
export default Feedback;
