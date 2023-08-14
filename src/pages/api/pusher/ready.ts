import { pusher } from "@/utils/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    user_id: string;
    channel: string;
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    await pusher.trigger(req.body.channel, "user-ready", {
      user_id: req.body.user_id,
    });
    return res.status(200).send("ok");
  } catch (error) {
    console.error(error);
  }
};

export default handler;
