import mongoose from "mongoose";

export interface ISession {
  user_id: string;
  answers: Map<string, string | null>;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    user_id: { type: String, required: true },
    answers: {
      type: Map,
      of: { type: String },
      required: true,
    },
  },
  { timestamps: true }
);
const Session =
  (mongoose.models.Session as mongoose.Model<ISession>) ||
  mongoose.model<ISession>("Session", sessionSchema);
export default Session;
