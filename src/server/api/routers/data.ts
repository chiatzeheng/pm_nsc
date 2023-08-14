import User, { IUser } from "@/models/User";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
  superAdminProcedure,
} from "../trpc";

import { IFeedback } from "@/models/Feedback";
import Feedback from "@/models/Feedback";

export const dataRouter = createTRPCRouter({
  getLeaderboard: publicProcedure.query(async () => {
    const data = await User.find({
      role: "student",
      isEmailVerified: true,
    })
      .sort("-score")
      .select("-password")
      .select("-email")
      .select("-_id")
      .select("-isEmailVerified");
    return data;
  }),
  getLeaderboardByClass: adminProcedure
    .input(
      z.object({
        course: z.string().optional(),
        class: z.string().optional(),
        name: z.string().optional(),
        page: z.number(),
        pageSize: z.number(),
      })
    )
    .query(async ({ input }) => {
      if (!input.name) input.name = "";
      const nameRegex = new RegExp(input.name);
      let stats: IUser[];
      let totalRowCount: number;
      if (!input.course && !input.class) {
        stats = await User.find({
          name: { $regex: nameRegex, $options: "i" },
        })
          .sort("-score")
          .skip(input.page * input.pageSize)
          .limit(input.pageSize)
          .select("-password");
        totalRowCount = await User.countDocuments({
          name: { $regex: nameRegex, $options: "i" },
        });
      } else if (!input.class) {
        stats = await User.find({
          name: { $regex: nameRegex, $options: "i" },
          course: input.course,
        })
          .select("-password")
          .sort("-score")
          .skip(input.page * input.pageSize)
          .limit(input.pageSize);
        totalRowCount = await User.countDocuments({
          name: { $regex: nameRegex, $options: "i" },
          course: input.course,
        });
      } else {
        stats = await User.find({
          name: { $regex: nameRegex, $options: "i" },
          course: input.course,
          class: input.class,
        })
          .sort("-score")
          .skip(input.page * input.pageSize)
          .limit(input.pageSize)
          .select("-password");
        totalRowCount = await User.countDocuments({
          name: { $regex: nameRegex, $options: "i" },
          course: input.course,
          class: input.class,
        });
      }
      return {
        stats,
        totalRowCount,
      };
    }),
  getFeedback: adminProcedure
    .input(
      z.object({
        category: z.string().optional(),
        subject: z.string().optional(),
        page: z.number(),
        pageSize: z.number(),
        archived: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.subject) input.subject = "";
      const subjectRegex = new RegExp(input.subject);
      let feedbackData: IFeedback[];
      let totalRowCount: number;
      // if (!input.category) {
      // feedbackData = await Feedback.find({
      //   subject: { $regex: subjectRegex, $options: "i" },
      // })
      //   .skip(input.page * input.pageSize)
      //   .limit(input.pageSize);

      //         subject: { $regex: subjectRegex, $options: "i" },
      // category: input.category,
      let matchArchived;
      if (input.archived === "Active") {
        matchArchived = false;
      } else if (input.archived === "Archived") {
        matchArchived = true;
      } else {
        matchArchived = { $exists: true };
      }
      feedbackData = await Feedback.aggregate([
        {
          $match: {
            subject: { $regex: subjectRegex, $options: "i" },
            category: input.category || { $exists: true }, // Add this stage to filter by category if it exists in input
            archived: matchArchived,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $set: {
            user: { $arrayElemAt: ["$user.name", 0] },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: input.page * input.pageSize,
        },
        {
          $limit: input.pageSize,
        },
      ]);

      totalRowCount = await Feedback.countDocuments({
        subject: { $regex: subjectRegex, $options: "i" },
      });
      // } else {
      //   feedbackData = await Feedback.aggregate([
      //     {
      //       $match: {
      //         subject: { $regex: subjectRegex, $options: "i" },
      //         category: input.category,
      //       },
      //     },
      //     {
      //       $lookup: {
      //         from: "users",
      //         localField: "userId",
      //         foreignField: "_id",
      //         as: "user",
      //       },
      //     },
      //     {
      //       $set: {
      //         user: { $arrayElemAt: ["$user.name", 0] },
      //       },
      //     },
      //     {
      //       $sort: {
      //         createdAt: -1,
      //       },
      //     },
      //     {
      //       $skip: input.page * input.pageSize,
      //     },
      //     {
      //       $limit: input.pageSize,
      //     },
      //   ]);
      //   totalRowCount = await Feedback.countDocuments({
      //     subject: { $regex: subjectRegex, $options: "i" },
      //     category: input.category,
      //   });
      // }
      return {
        feedbackData,
        totalRowCount,
      };
    }),

  getOverviewByClass: publicProcedure
    .input(
      z.object({ course: z.string().optional(), class: z.string().optional() })
    )
    .query(async ({ input }) => {
      let users: IUser[];
      if (!input.course && !input.class) {
        users = await User.find({}).select("-password");
      } else if (!input.class) {
        users = await User.find({ course: input.course }).select("-password");
      } else {
        users = await User.find({
          course: input.course,
          class: input.class,
        }).select("-password");
      }

      // console.log("filtered users", users);

      const response = {
        totalCorrectQuestions: 0,
        totalQuestionsAnswered: 0,
        accuracyByCategory: {} as Record<string, number>,
        totalUsers: users.length,
        mostQuestionsAnswered: 0,
      };

      users.forEach((user) => {
        Object.keys(user.statistics).forEach((key) => {
          const totalCorrect =
            user.statistics[key as keyof typeof user.statistics].total_correct;
          const totalAnswered =
            user.statistics[key as keyof typeof user.statistics].total;
          const accuracy =
            totalAnswered === 0 ? 0 : totalCorrect / totalAnswered;
          response.accuracyByCategory[key] = response.accuracyByCategory[key]
            ? response.accuracyByCategory[key]! + accuracy
            : accuracy;
          response.totalCorrectQuestions += totalCorrect;
          response.totalQuestionsAnswered += totalAnswered;
          response.mostQuestionsAnswered = Math.max(
            response.mostQuestionsAnswered,
            totalAnswered
          );
        });
      });

      Object.keys(response.accuracyByCategory).forEach((key) => {
        const categoryAccuracy = Math.round(
          (response.accuracyByCategory[key]! / users.length) * 100
        );
        response.accuracyByCategory[key] = categoryAccuracy;
      });

      return response;
    }),

  getTotalCorrectQuestions: publicProcedure.query(async () => {
    const users = await User.find({}).select("-password");
    let totalCorrect = 0;
    users.forEach((user) => {
      Object.keys(user.statistics).forEach((key) => {
        totalCorrect +=
          user.statistics[key as keyof typeof user.statistics].total_correct;
      });
    });
    return totalCorrect;
  }),
  getTotalQuestionsAnswered: publicProcedure.query(async () => {
    const users = await User.find({}).select("-password");
    let totalAnswered = 0;
    users.forEach((user) => {
      Object.keys(user.statistics).forEach((key) => {
        totalAnswered +=
          user.statistics[key as keyof typeof user.statistics].total;
      });
    });
    return totalAnswered;
  }),
  getOverallStatistics: publicProcedure.query(async () => {
    const users = await User.find({}).select("-password");
    const categories: Record<string, number> = {};

    users.forEach((user) => {
      Object.keys(user.statistics).forEach((key) => {
        const totalCorrect =
          user.statistics[key as keyof typeof user.statistics].total_correct;
        const totalAnswered =
          user.statistics[key as keyof typeof user.statistics].total;
        const accuracy = totalAnswered === 0 ? 0 : totalCorrect / totalAnswered;
        categories[key] = categories[key]
          ? categories[key]! + accuracy
          : accuracy;
      });
    });

    const accuracyByCategory: Record<string, number> = {};

    Object.keys(categories).forEach((key) => {
      const categoryAccuracy = Math.round(
        (categories[key]! / users.length) * 100
      );
      accuracyByCategory[key] = categoryAccuracy;
    });

    return accuracyByCategory;
  }),
  getTotalUsers: publicProcedure.query(async () => {
    const users = await User.find({}).select("-password");
    return users.length;
  }),
  getMostQuestionsAnswered: publicProcedure.query(async () => {
    const users = await User.find({}).select("-password");
    let max = 0;
    users.forEach((user) => {
      let totalAnswered = 0;
      Object.keys(user.statistics).forEach((key) => {
        totalAnswered +=
          user.statistics[key as keyof typeof user.statistics].total;
      });
      if (totalAnswered > max) {
        max = totalAnswered;
      }
    });
    return max;
  }),
  // const { mutate: updateDB } = api.user.updateStatistics.useMutation();
  updateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
          course: z.string().optional(),
          class: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await User.findById(input.id).select("-password");
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }
        // console.log("the data", input.data);

        Object.keys(input.data).forEach((key) => {
          // console.log(key);
          (user[key as keyof typeof user] as string) =
            input.data[key as keyof typeof input.data]!;
        });

        await user.save();
        return { message: "Update successful", code: "SUCCESS" };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err as string,
        });
      }
    }),
  resetAllUserScores: superAdminProcedure.mutation(async () => {
    try {
      const result = await User.updateMany(
        {},
        {
          $set: {
            score: 0,
          },
        }
      );
      return { message: "Score reset successful", code: "SUCCESS" };
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err as string,
      });
    }
  }),

  resetUserScore: superAdminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await User.findById(input.id).select("-password");
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }
        user.score = 0;

        await user.save();
        return { message: "Score reset successful", code: "SUCCESS" };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err as string,
        });
      }
    }),
  resetAllStatistics: superAdminProcedure.mutation(async () => {
    try {
      const result = await User.updateMany(
        {},
        {
          $set: {
            score: 0,
            statistics: {
              Operations: {
                total: 0,
                total_correct: 0,
                total_wrong: 0,
              },
              Selection: {
                total: 0,
                total_correct: 0,
                total_wrong: 0,
              },
              Repetition: {
                total: 0,
                total_correct: 0,
                total_wrong: 0,
              },
              Arrays: {
                total: 0,
                total_correct: 0,
                total_wrong: 0,
              },
              Functions: {
                total: 0,
                total_correct: 0,
                total_wrong: 0,
              },
            },
          },
        }
      );

      console.log(result);

      return {
        message: "Statistics have been successfully reset.",
        code: "SUCCESS",
      };
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err as string,
      });
    }
  }),

  deleteFeedbackById: adminProcedure
    .input(z.object({ feedback_id: z.string() }))
    .mutation(async ({ input }) => {
      await Feedback.findByIdAndDelete(input.feedback_id);
    }),

  archiveFeedbackById: adminProcedure
    .input(z.object({ feedback_id: z.string() }))
    .mutation(async ({ input }) => {
      const feedback = await Feedback.findById(input.feedback_id);
      if (!feedback) {
        throw new TRPCError("Feedback not found");
      }
      const updatedFeedback = await Feedback.findByIdAndUpdate(
        input.feedback_id,
        { archived: !feedback.archived },
        { new: true }
      );
      return updatedFeedback;
    }),
});
