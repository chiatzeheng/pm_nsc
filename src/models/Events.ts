import mongoose from "mongoose";

export interface IEvents {
  _id: string;
  eventname: string;
  description: string;
  endDate: Date;
  startDate: Date;
  multiplier: {
    type: "x" | "+";
    value: number;
  };
  topic: "Operations" | "Selection" | "Repetition" | "Arrays" | "Functions";
  status: "active" | "inactive" | "completed" | "cancelled" | "upcoming";
}

const eventSchema = new mongoose.Schema<IEvents>(
  {
    eventname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    topic: {
      type: String,
      required: true,
      enum: ["Operations", "Selection", "Repetition", "Arrays", "Functions"],
    },
    multiplier: {
      type: {
        type: String,
        enum: ["x", "+"],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed", "cancelled", "upcoming"],
      required: true,
    },
  },
  { timestamps: true }
);

const Event =
  (mongoose.models.Event as mongoose.Model<IEvents>) ||
  mongoose.model<IEvents>("Event", eventSchema);

export default Event;
