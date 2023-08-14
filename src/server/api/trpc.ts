/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";

/** Replace this with an object if you want to pass things to `createContextInner`. */

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return {
    req: _opts.req,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */
import { initTRPC, MiddlewareFunction, TRPCError } from "@trpc/server";
import superjson from "superjson";
import Users from "@/models/User";
import type { IUser } from "@/models/User";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */

export const publicProcedure = t.procedure;
const isAuth = t.middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  let token: string | undefined = req.headers.authorization;
  if (!token) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }
  token = token.replace("Bearer ", "");
  const decoded_token = jwt.verify(token, env.JWT_SECRET) as {
    user_id: string;
  };
  const user = (await Users.findById(decoded_token.user_id).select(
    "-password"
  )) as IUser;
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user } });
});

// extend isAuth check for admin
const isAdmin = isAuth.unstable_pipe(async ({ ctx, next }) => {
  const { user } = ctx;
  if (user.role !== "admin" && user.role !== "superadmin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});

// extend isAuth to check for superadmin

const isSuperAdmin = isAuth.unstable_pipe(async ({ ctx, next }) => {
  const { user } = ctx;
  if (user.role !== "superadmin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});

export const privateProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdmin);
export const superAdminProcedure = t.procedure.use(isSuperAdmin);
