import { createNextApiHandler } from "@trpc/server/adapters/next";

import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import mongoose from "mongoose";
import { env } from "@/env.mjs";
console.log("tynna connect to mongo");
mongoose.set("strictQuery", false);
mongoose
  .connect(env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});
