import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import mongoose from "mongoose";
import { env } from "@/env.mjs";
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    _type: "post" | "resource";
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  // this is a webhook that will be called by sanity when a post or resource is deleted
  // it will then update all users to decrement their announcement_count or resource_count
  await mongoose.connect(env.MONGO_URL);
  if (!req.body._type) return res.status(400).send("no type");
  if (req.body._type !== "post" && req.body._type !== "resource")
    return res.status(400).send("invalid type");
  try {
    await User.updateMany(
      {},
      {
        $inc: {
          announcements_count: req.body._type === "post" ? -1 : 0,
          resources_count: req.body._type === "resource" ? -1 : 0,
        },
      }
    );
    return res.status(200).send("ok");
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

export default handler;
