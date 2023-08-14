import produce from "immer";
import React from "react";
import type { IUser } from "./models/User";
import { api } from "./utils/api";
import { getCategory } from "./utils/topics";
import TOPICS from "./utils/topics";

export type innerStatisticType = {
  total_correct: number;
  total_wrong: number;
  total: number;
};

export type statisticType = {
  0: innerStatisticType;
  1: innerStatisticType;
  2: innerStatisticType;
  3: innerStatisticType;
  4: innerStatisticType;
  5: innerStatisticType;
  6: innerStatisticType;
  7: innerStatisticType;
  8: innerStatisticType;
  9: innerStatisticType;
  10: innerStatisticType;
  11: innerStatisticType;
  12: innerStatisticType;
};

export type HistoryType = {
  correct: boolean;
  mode: "single" | "multi";
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  userAnswer: string;
  answer: string;
  question: string;
};

interface IAppContext {
  mode: "dark" | "light";
  setMode: React.Dispatch<React.SetStateAction<"dark" | "light">>;
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  statistics: statisticType;
  setStatistics: React.Dispatch<React.SetStateAction<statisticType>>;
  getTotalQuestions: (statistics: statisticType) => number;
  updateStastics: (
    topic: number,

    question_id: string,
    answer: string,
    mode: "single" | "multi",
    difficulty: "beginner" | "intermediate" | "advanced",

    question: string,
    onError: () => void,
    onNext: (correct: boolean, has_reached_max: boolean) => void
  ) => void;
  getTotalCorrect: (statistics: statisticType) => number;
  history: HistoryType[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryType[]>>;
  resetStatistics: () => void;
}

const AppContext = React.createContext<IAppContext>({} as IAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<"dark" | "light">("light");
  const [user, setUser] = React.useState<IUser | undefined>({} as IUser);
  const [isAuth, setIsAuth] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [history, setHistory] = React.useState<HistoryType[]>([]);
  const [statistics, setStatistics] = React.useState({
    0: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    1: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    2: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    3: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    4: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    5: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    6: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    7: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    8: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    9: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    10: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    11: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
    12: {
      total_correct: 0,
      total_wrong: 0,
      total: 0,
    },
  });

  const getTotalQuestions = (statistics: statisticType) => {
    let total = 0;
    for (let i = 0; i < 13; i++) {
      total += statistics[i as keyof typeof statistics].total;
    }
    return total;
  };

  const { mutate: updateDB } = api.user.updateStatistics.useMutation();

  const updateStastics = (
    topic: number,
    question_id: string,
    answer: string,
    mode: "single" | "multi",
    difficulty: "beginner" | "intermediate" | "advanced",
    question: string,
    onError: () => void,
    onNext: (correct: boolean, has_reached_max: boolean) => void
  ) => {
    updateDB(
      {
        category: getCategory(topic as keyof typeof TOPICS),
        topic,
        question_id,
        answer,
        mode,
        difficulty,
      },
      {
        onSuccess: (data) => {
          if (!data) return;

          const { correct, correctAnswer } = data;
          onNext(correct, data.has_reached_max);
          // this function updates both the state and the database for the statistics
          if (correct) {
            setStatistics(
              produce(statistics, (draft) => {
                draft[topic as keyof typeof statistics].total_correct += 1;
                draft[topic as keyof typeof statistics].total += 1;
              })
            );
          } else {
            setStatistics(
              produce(statistics, (draft) => {
                draft[topic as keyof typeof statistics].total_wrong += 1;
                draft[topic as keyof typeof statistics].total += 1;
              })
            );
          }
          setHistory(
            produce(history, (draft) => {
              draft.push({
                correct,
                mode,
                difficulty,
                topic: TOPICS[topic as keyof typeof TOPICS],
                userAnswer: answer,
                answer: correctAnswer || "",
                question,
              });
            })
          );
        },
        onError: () => {
          onError();
        },
      }
    );
  };

  const getTotalCorrect = React.useCallback(
    (statistics: statisticType): number => {
      let total = 0;
      for (let i = 0; i < 13; i++) {
        total += statistics[i as keyof typeof statistics].total_correct;
      }
      return total;
    },
    []
  );

  const resetStatistics = React.useCallback(() => {
    setStatistics({
      0: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      1: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      2: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      3: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      4: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      5: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      6: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      7: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      8: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      9: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      10: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      11: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
      12: {
        total_correct: 0,
        total_wrong: 0,
        total: 0,
      },
    });
    setHistory([]);
  }, []);
  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        user,
        setUser,
        isAuth,
        setIsAuth,
        isLoading,
        setIsLoading,
        statistics,
        setStatistics,
        getTotalQuestions,
        updateStastics,
        resetStatistics,
        getTotalCorrect,
        history,
        setHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
