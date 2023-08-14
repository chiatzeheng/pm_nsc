import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { CategoryTypes, getCategory } from "@/utils/topics";
import TOPICS from "@/utils/topics";
import { registerHtml } from "htmls/registerHtml";
import { passwordHtml } from "htmls/passwordHtml";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import Events from "@/models/Events";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";
import Session from "@/models/Session";
import Dailylog from "@/models/Dailylog";
import dailyCap from "@/utils/dailycap";
import { topic_scores } from "@/utils/scores";

const sendEmail = async (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    name: "gmail.com",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.NODEMAIL_EMAIL,
      pass: env.NODEMAIL_PW,
    },
  });
  const mailOptions = {
    from: "PracticeMe <socpracticeme@gmail.com>",
    to: email,
    subject: subject,
    html: html,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

export const userRouter = createTRPCRouter({
  getMe: privateProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        school: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      console.log(input);
      let user = await User.findOne({
        email: input.email.toLowerCase(),
      }).select("-password");
      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }
      if (input.email.toLowerCase().includes("+")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Request",
        });
      }
      const hashedPassword = await bcrypt.hash(input.password, 12);
      user = await User.create({
        email: input.email.toLowerCase(),
        name: input.name,
        school: input.school,
        password: hashedPassword,
        score: 0,
        isEmailVerified: false,
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
      });
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "7d",
      });
      await sendEmail(
        input.email.toLowerCase(),
        "Verify your email",
        registerHtml(token)
      );
      return {
        token,
        message:
          "Please check your inbox to verify your account! If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.",
        code: "SUCCESS",
      };
    }),
  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decodedToken = jwt.verify(input.token, env.JWT_SECRET) as {
          user_id: string;
        };
        const user = await User.findById(decodedToken.user_id).select(
          "-password"
        );
        console.log(decodedToken);
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }
        if (user.isEmailVerified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email already verified",
          });
        }
        console.log("elliott why is the email confirming?", new Date());
        user.isEmailVerified = true;
        await user.save();
        return {
          message: "Email verified successfully! You may now log in.",
          code: "SUCCESS",
        };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err as string,
        });
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({
        email: input.email.toLowerCase(),
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }
      if (!(await bcrypt.compare(input.password, user.password))) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }
      if (!user.isEmailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Email not verified! Please check your inbox for the verification email or click on the resend button on the register tab.",
        });
      }
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return { token };
    }),
  sendRequestPasswordEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({
        email: input.email.toLowerCase(),
      }).select("-password");
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not found!",
        });
      }
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "1h",
      });
      await sendEmail(
        input.email.toLowerCase(),
        "Reset your Password",
        passwordHtml(token)
      );
      return {
        message:
          "Email sent successfully! If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.",
        code: "SUCCESS",
      };
    }),
  resendVerificationEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({
        email: input.email.toLowerCase(),
      }).select("-password");
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not found!",
        });
      }
      if (user.isEmailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already verified",
        });
      }
      const token = jwt.sign({ user_id: user._id }, env.JWT_SECRET, {
        expiresIn: "7d",
      });
      await sendEmail(
        input.email.toLowerCase(),
        "Verify your email",
        registerHtml(token)
      );
      return {
        message:
          "Email sent successfully! If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.",
        code: "SUCCESS",
      };
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decodedToken = jwt.verify(input.token, env.JWT_SECRET) as {
          user_id: string;
        };
        const user = await User.findById(decodedToken.user_id);
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }
        const hashedPassword = await bcrypt.hash(input.password, 12);
        user.password = hashedPassword;
        await user.save();
        return { message: "Password reset successfully!", code: "SUCCESS" };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err as string,
        });
      }
    }),
  updateStatistics: privateProcedure
    .input(
      z.object({
        category: z.enum([
          "Operations",
          "Selection",
          "Repetition",
          "Arrays",
          "Functions",
        ]),
        topic: z.number(),
        question_id: z.string(),
        answer: z.string(),
        mode: z.enum(["single", "multi"]),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await User.findById(ctx.user._id).select("-password");
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      const currentSession = await Session.findOne({
        user_id: ctx.user._id,
      });

      if (!currentSession) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session not found",
        });
      }

      if (
        currentSession.answers.get(input.question_id) === undefined ||
        currentSession.answers.get(input.question_id) === null
      ) {
        await Session.deleteMany({ user_id: ctx.user._id });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Anomaly detected",
        });
      }

      const dailyLog = await Dailylog.findOneAndUpdate(
        { user_id: ctx.user._id },
        {
          $inc: {
            [`questions_done.${input.topic}`]: 1,
          },
        },
        { new: true, upsert: true }
      );

      const dailyLogObj = Object.fromEntries(dailyLog.questions_done);

      const dailyCategoriesLog: {
        Operations?: number;
        Selection?: number;
        Repetition?: number;
        Arrays?: number;
        Functions?: number;
      } = {};

      Object.keys(dailyLogObj).forEach((topic) => {
        const category = getCategory(parseInt(topic) as keyof typeof TOPICS);
        dailyCategoriesLog[category] =
          (dailyCategoriesLog[category] || 0) + dailyLogObj[topic]!;
      });

      let score = topic_scores[input.topic as keyof typeof TOPICS];
      if (input.difficulty === "intermediate") score *= 1.5;

      const category = getCategory(input.topic as keyof typeof TOPICS);

      // if ((dailyCategoriesLog[category] || 0) > dailyCap[category]) score /= 2;
      let has_reached_max = false;
      if ((dailyCategoriesLog[category] || 0) > dailyCap[category]) {
        score = 0;
        has_reached_max = true;
      }

      const correctAnswer = currentSession.answers.get(
        input.question_id
      ) as string;

      const correct =
        correctAnswer.toString().trim().toLowerCase() ===
        input.answer.toString().trim().toLowerCase();

      if (user?.statistics) {
        user.statistics[input.category].total++;
        if (correct) {
          user.statistics[input.category].total_correct++;
          // if (input.mode === "single") {
          const activeEvents = await Events.find({
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
            topic: input.category,
          }).sort({ startDate: "asc" });
          if (activeEvents.length === 0) {
            user.score += score;
          }

          activeEvents.forEach((event) => {
            if (event.multiplier.type === "+") {
              user.score += score + event.multiplier.value;
            } else if (event.multiplier.type === "x") {
              user.score += score * event.multiplier.value;
            }
          });
          // }
        } else {
          user.statistics[input.category].total_wrong++;
        }

        if (currentSession.answers)
          currentSession.answers.set(input.question_id, null);

        await currentSession.save();
        await user.save();
        return { correct, correctAnswer, has_reached_max };
      }
    }),
  getDashboardStatistics: privateProcedure.query(async ({ ctx }) => {
    const accuracies = {
      Operations: 0,
      Selection: 0,
      Repetition: 0,
      Arrays: 0,
      Functions: 0,
    };
    let totalAttemptedQuestions = 0;
    let totalCorrectQuestions = 0;
    const user = await User.findById(ctx.user._id).select("-password");
    ["Operations", "Selection", "Repetition", "Arrays", "Functions"].forEach(
      (c) => {
        const category = c as CategoryTypes;
        if (user?.statistics) {
          const accuracy =
            user.statistics[category].total_correct /
            user.statistics[category].total;
          if (isNaN(accuracy)) {
            accuracies[category] = 0;
          } else {
            accuracies[category] = accuracy * 100;
          }
          totalAttemptedQuestions += user.statistics[category].total;
          totalCorrectQuestions += user.statistics[category].total_correct;
        }
      }
    );
    return { accuracies, totalAttemptedQuestions, totalCorrectQuestions };
  }),
  // addScore: privateProcedure
  //   .input(
  //     z.object({
  //       score: z.number(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const user = await User.findById(ctx.user._id).select("-password");
  //     if (!user) {
  //       throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "User not found",
  //       });
  //     }
  //     user.score += input.score;
  //     await user.save();
  //     return { user };
  //   }),
  submitFeedback: privateProcedure
    .input(
      z.object({
        category: z.string(),
        subject: z.string(),
        comment: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await User.findById(ctx.user._id).select("-password");
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      const feedback = await Feedback.create({
        userId: new ObjectId(user._id),
        category: input.category,
        subject: input.subject,
        comment: input.comment,
        archived: false,
      });
      return { feedback };
    }),
  deleteUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .mutation(async ({ input }) => {
      await User.findByIdAndDelete(input.user_id);
    }),
  getAllUsers: publicProcedure.mutation(async () => {
    const users = await User.find().select("-password");
    return users;
  }),
  // updateQuestionLog: privateProcedure
  //   .input(
  //     z.object(
  //       Object.keys(TOPICS).reduce((acc, cur) => {
  //         return {
  //           ...acc,
  //           [cur]: z.number(),
  //         };
  //       }, {})
  //     )
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     console.log(input);

  //     const incrementMap = Object.keys(input).reduce((acc, cur) => {
  //       return {
  //         ...acc,
  //         [`questions_done.${cur}`]: input[cur as keyof typeof input],
  //       };
  //     }, {});

  //     await Dailylog.findOneAndUpdate(
  //       { user_id: ctx.user._id },
  //       {
  //         $inc: incrementMap,
  //       },
  //       { upsert: true }
  //     );
  //   }),
  readAnnouncement: privateProcedure.mutation(async ({ ctx }) => {
    await User.findByIdAndUpdate(ctx.user._id, {
      $set: { announcements_count: 0 },
    });
  }),
  readResources: privateProcedure.mutation(async ({ ctx }) => {
    await User.findByIdAndUpdate(ctx.user._id, {
      $set: { resources_count: 0 },
    });
  }),
});
