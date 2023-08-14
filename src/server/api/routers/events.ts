import Events from "@/models/Events";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import { publicProcedure, adminProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  getEvents: publicProcedure.query(async () => {
    const data = await Events.find({});
    return data;
  }),
  getActiveEvents: publicProcedure.query(async () => {
    // find the active events based on the start and end date please
    const data = await Events.find({
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    }).sort({ startDate: "asc" });
    return data;
  }),
  getUpcomingEvents: publicProcedure.query(async () => {
    // find the upcoming events based on the start and end date please
    const data = await Events.find({
      startDate: { $gte: new Date() },
    }).sort({ startDate: "asc" });
    return data;
  }),
  updateEvent: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          eventname: z.string().optional(),
          desc: z.string().optional(),
          startdate: z.string().optional(),
          enddate: z.string().optional(),
          multiplierValue: z.number().optional(),
          multiplierType: z.string().optional(),
          status: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const event = await Events.findById(input.id);
        if (!event) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "event not found",
          });
        }
        event.eventname = input.data.eventname || event.eventname;
        event.description = input.data.desc || event.description;
        event.startDate = input.data.startdate
          ? new Date(input.data.startdate)
          : event.startDate;
        event.endDate = input.data.enddate
          ? new Date(input.data.enddate)
          : event.endDate;
        event.multiplier.value =
          input.data.multiplierValue || event.multiplier.value;
        event.multiplier.type =
          (input.data.multiplierType as "x" | "+") || event.multiplier.type;

        await event.save();
        return { message: "Update successful", code: "SUCCESS" };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err as string,
        });
      }
    }),
  createEvent: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        start: z.date(),
        end: z.date(),
        scalar: z.number(),
        multiplyer: z.enum(["x", "+"]),
        category: z.enum([
          "Operations",
          "Selection",
          "Repetition",
          "Arrays",
          "Functions",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const event = await Events.create({
          eventname: input.name,
          description: input.description,
          startDate: input.start,
          endDate: input.end,
          multiplier: {
            type: input.multiplyer,
            value: input.scalar,
          },
          topic: input.category,
          status: "active",
        });
        event.topic = input.category;
        await event.save();

        return { message: "Event created successfully", code: "SUCCESS" };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err as string,
        });
      }
    }),
  deleteAllEvents: adminProcedure.mutation(async () => {
    try {
      await Events.deleteMany({});
      return { message: "Events deleted successfully", code: "SUCCESS" };
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err as string,
      });
    }
  }),
});
