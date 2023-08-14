import mongoose from "mongoose";
export interface IAdmin {
  email: string;
  name: string;
  avatar?: string;
  password: string;
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    email: { type: String, required: true },
    name: String,
    password: {
      type: String,
      required: true,
    },
    avatar: String,
  },
  { timestamps: true }
);
const Admin =
  (mongoose.models.Admin as mongoose.Model<IAdmin>) ||
  mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;
