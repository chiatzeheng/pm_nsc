import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { questionsRouter } from "./routers/questions";
import { dataRouter } from "./routers/data";
import { eventRouter } from "./routers/events";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  questions: questionsRouter,
  data: dataRouter,
  event: eventRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
