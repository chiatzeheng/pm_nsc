import { pusher } from "@/utils/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    channel: string;
    topics: number[];
    difficulty: "beginner" | "intermediate" | "advanced";
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    await pusher.trigger(req.body.channel, "room-config", {
      topics: req.body.topics,
      difficulty: req.body.difficulty,
    });
    return res.status(200).send("ok");
  } catch (error) {
    console.error(error);
  }
};

export default handler;
