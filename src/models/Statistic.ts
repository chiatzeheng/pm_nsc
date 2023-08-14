import mongoose from "mongoose";
import type { innerStatisticType } from "@/context";
interface IStatistic {
  _id: string;
  Operations: innerStatisticType;
  Selection: innerStatisticType;
  Repetition: innerStatisticType;
  Arrays: innerStatisticType;
  Functions: innerStatisticType;
}

const statisticSchema = new mongoose.Schema<IStatistic>(
  {
    Operations: {
      total: Number,
      total_correct: Number,
      total_wrong: Number,
    },
    Selection: {
      total: Number,
      total_correct: Number,
      total_wrong: Number,
    },
    Repetition: {
      total: Number,
      total_correct: Number,
      total_wrong: Number,
    },
    Arrays: {
      total: Number,
      total_correct: Number,
      total_wrong: Number,
    },
    Functions: {
      total: Number,
      total_correct: Number,
      total_wrong: Number,
    },
  },
  { timestamps: true }
);
const Statistic =
  (mongoose.models.Statistic as mongoose.Model<IStatistic>) ||
  mongoose.model<IStatistic>("Statistic", statisticSchema);
export default Statistic;
