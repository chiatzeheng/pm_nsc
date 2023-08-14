import { z } from "zod";
import { uuid } from "uuidv4";
import ArrayIndexOperationsTemp from "@/game/ArrayIndexOperationsQnsClass";
import ArrayIndexTemp from "@/game/ArrayIndexQnsClass";
import ArrayLengthTemp from "@/game/ArrayLengthQnsClass";
import ArrayMethodsTemp from "@/game/ArrayMethodsQnsClass";
import BooleanOperatorTemplate from "@/game/BooleanQnsClass";
import FunctionScopeTemplate from "@/game/FunctionScopeQnsClass";
import PostPreIncreDecreOperatorTemplate from "@/game/PostPreIncreDecreQnsClass";
import ForRepetitionTemp from "@/game/RepetitionForQnsClass";
import WhileRepetitionTemp from "@/game/RepetitionWhileQnsClass";
import DoWhileRepetitionTemp from "@/game/RepetitionDoWhileQnsClass";
import IfElseSelectionTemplate from "@/game/SelectionIfElseQnsClass";
import SwitchSelectionTemp from "@/game/SelectionSwitchQnsClass";
import ShorthandTemp from "@/game/ShorthandQnsClass";

interface IGenerator {
  generateFullQuestion: (question: [string, string]) => string;
  generateAnswer: (question: string) => string;
  generateQuestion: (difficulty: string) => [string, string];
  fullQuestion: string;
  answer: string;
}

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import Session from "@/models/Session";
// import { encryptStringWithKey } from "@/utils/encrypt";

export const questionsRouter = createTRPCRouter({
  getQuestions: privateProcedure
    .input(
      z.object({
        num_questions: z.number(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        topics: z.array(z.number()).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const QUESTION_GENERATORS = {
        0: BooleanOperatorTemplate,
        1: ShorthandTemp,
        2: PostPreIncreDecreOperatorTemplate,
        3: IfElseSelectionTemplate,
        4: SwitchSelectionTemp,
        5: ForRepetitionTemp,
        6: WhileRepetitionTemp,
        7: DoWhileRepetitionTemp,
        8: ArrayLengthTemp,
        9: ArrayIndexTemp,
        10: ArrayIndexOperationsTemp,
        11: ArrayMethodsTemp,
        12: FunctionScopeTemplate,
      };
      const result = [];
      if (!input.topics) return [];
      try {
        for (let i = 0; i < input.num_questions; i++) {
          const randomGenerator = input.topics[
            Math.floor(Math.random() * input.topics.length)
          ] as number;
          const generator = new QUESTION_GENERATORS[
            randomGenerator as keyof typeof QUESTION_GENERATORS
          ](input.difficulty) as unknown as IGenerator;
          if (generator.answer === "") {
            i--;
            continue;
          }

          result.push({
            id: uuid(),
            question: generator.fullQuestion,
            answer: generator.answer,
            topic: randomGenerator,
          });
        }

        const answersDict = result.reduce((acc, curr) => {
          const { id, answer } = curr;
          return { ...acc, [id]: answer };
        }, {});

        // remove the answer field from result and assign to variable

        const resultToClient = result.map((curr) => {
          return {
            id: curr.id,
            // question: encryptStringWithKey(curr.question),
            question: curr.question,
            topic: curr.topic,
          };
        });

        const newSession = {
          user_id: ctx.user._id,
          answers: answersDict,
        };

        await Session.deleteMany({ user_id: ctx.user._id });

        await Session.create(newSession);

        return resultToClient;
      } catch (error) {
        console.error(error);
      }
    }),
});
