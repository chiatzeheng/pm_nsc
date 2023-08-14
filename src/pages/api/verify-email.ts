import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";
import { env } from "@/env.mjs";

// http://localhost:3000/api/verify-email?token=
// !!!! THIS ROUTE IS DEPRECATED !!!!
const verifyEmailHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const ctx = createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  try {
    const token: string = req.query.token as string;
    console.log(token);
    const result = await caller.user.verifyEmail({ token });
    res.redirect(
      `${env.URL}/authenticate?message=${result.message}&type=${result.code}`
    );
  } catch (e) {
    const err = e as { code: string; message: string };
    console.error(err);
    res.redirect(
      `${env.URL}/authenticate?message=${err.message}&type=${err.code}`
    );
  }
};

export default verifyEmailHandler;
