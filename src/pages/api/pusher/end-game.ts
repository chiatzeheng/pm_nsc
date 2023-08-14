import { pusher } from "@/utils/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    channel: string;
    user_id: string;
    timestamp: Date;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    await pusher.trigger(req.body.channel, "user-end", {
      user_id: req.body.user_id,
      timestamp: req.body.timestamp,
    });
    return res.status(200).send("ok");
  } catch (error) {
    console.error(error);
  }
};

export default handler;
