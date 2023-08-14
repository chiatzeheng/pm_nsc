import mongoose from "mongoose";

export interface IDailylog {
  user_id: string;
  questions_done: Map<string, number>;
}

const dailyLogSchema = new mongoose.Schema<IDailylog>(
  {
    user_id: { type: String, required: true },
    questions_done: {
      type: Map,
      of: { type: Number },
      required: true,
    },
  },
  { timestamps: true }
);
const Dailylog =
  (mongoose.models.Dailylog as mongoose.Model<IDailylog>) ||
  mongoose.model<IDailylog>("Dailylog", dailyLogSchema);
export default Dailylog;
