import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";
import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import TOPICS from "@/utils/topics";
import React from "react";
import Head from "next/head";
import { Stack } from "@mui/system";
import CodeSnippet from "@/components/CodeSnippet";
import { toast } from "react-hot-toast";
import ProgressBar from "@/components/ProgressBar";
import Pusher from "pusher-js";
import type { MultiMember, PusherMember } from ".";
import axios from "axios";
import Confetti from "react-confetti";

type Router = {
  code: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topics: string[];
};

const MultiGame = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const theme = useTheme();
  const query = router.query as unknown as Router;
  const { updateStastics, isAuth, user, statistics, resetStatistics } =
    useGlobalContext();
  const [members, setMembers] = React.useState<MultiMember[]>(
    [] as MultiMember[]
  );
  const [totalCorrect, setTotalCorrect] = React.useState(0);
  const [ended, setEnded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const channelCode = React.useMemo(() => {
    return "presence-" + query.code + "-game";
  }, [query.code]);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [answerInput, setAnswerInput] = React.useState("");
  const [leaderboard, setLeaderboard] = React.useState<string[]>([]);
  // const { mutate: addScore } = api.user.addScore.useMutation();
  React.useEffect(() => {
    resetStatistics();
  }, [resetStatistics]);

  React.useLayoutEffect(() => {
    if (!router.query.difficulty || !router.query.topics) {
      if (isAuth) {
        window.location.href = "/dashboard";
        // await router.replace("/dashboard").catch(console.error);
      } else {
        window.location.href = "/authenticate";
        // await router.replace("/authenticate").catch(console.error);
      }
    }
  }, [router.query.difficulty, router.query.topics, isAuth]);
  React.useEffect(() => {
    if (!user || !isAuth || !channelCode) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
      authEndpoint: "/api/auth/pusher",
      auth: {
        params: {
          user_id: user._id,
        },
      },
    });
    const channel = pusher.subscribe(channelCode);
    channel.bind(
      "pusher:subscription_succeeded",
      (membersObj: { members: PusherMember }) => {
        setMembers(
          Object.entries(membersObj.members).map(([id, ifo]) => {
            const info = ifo as PusherMember["info"];
            return {
              id,
              name: info.name,
              email: info.email,
              ready: info.ready,
              percentage: info.percentage,
            };
          })
        );
      }
    );
    channel.bind("pusher:member_added", (member: PusherMember) => {
      setMembers((prev) => {
        return [
          ...prev,
          {
            id: member.id,
            name: member.info.name,
            email: member.info.email,
            percentage: member.info.percentage,
            ready: false,
          },
        ];
      });
    });
    channel.bind("pusher:subscription_error", (error: any) => {
      console.error(error);
      if (isAuth) {
        router.replace("/dashboard").catch(console.error);
      } else {
        router.replace("/authenticate").catch(console.error);
      }
    });
    channel.bind("pusher:member_removed", (member: PusherMember) => {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    });
    channel.bind(
      "update-state",
      (data: { percentage: number; user_id: string }) => {
        setMembers((prev) => {
          return prev.map((member) => {
            if (member.id === data.user_id) {
              return {
                ...member,
                percentage: data.percentage,
              };
            }
            return member;
          });
        });
      }
    );
    channel.bind("user-end", (data: { user_id: string; timestamp: Date }) => {
      setLeaderboard((prev) => [...prev, data.user_id]);
    });
    return () => {
      console.log("unsubscribe");
      pusher.unsubscribe(channelCode);
    };
  }, [user, isAuth, channelCode, router]);
  const { data: questions, isLoading } = api.questions.getQuestions.useQuery(
    {
      num_questions: 20,
      difficulty: query.difficulty,
      topics: Array.isArray(query.topics)
        ? query.topics.map((t) => parseInt(t))
        : [parseInt(query.topics)],
    },
    {
      //   enabled: false,
      staleTime: Infinity,
      retry: false,
    }
  );

  const onError = () => {
    window.location.href = "/dashboard";
  };

  const onNext = (correct: boolean, has_reached_max: boolean) => {
    if (correct) {
      toast.success("Correct answer!");
      setTotalCorrect((prev) => prev + 1);
      const percentage =
        members.find((member) => member.id === user?._id)?.percentage || 0;
      axios
        .post("/api/pusher/update-state", {
          channel: channelCode,
          percentage: percentage + 10,
          user_id: user?._id,
        })
        .catch(console.error);
    } else {
      toast.error("Wrong answer!");
    }
    if (has_reached_max) {
      toast("You have reached the daily cap for this topic!", {
        icon: "🔥",
      });
    }
  };

  const handleNext = () => {
    if (!questions) return;
    if (ended) return;
    updateStastics(
      questions[questionIndex]?.topic as number,
      questions[questionIndex]?.id as string,
      answerInput,
      "multi",
      query.difficulty,
      questions[questionIndex]?.question as string,
      onError,
      onNext
    );

    setAnswerInput("");
    setQuestionIndex((prev) => prev + 1);
  };
  React.useEffect(() => {
    if (!user) return;
    if (ended) return;
    // console.log("total correct", totalCorrect);
    if (questionIndex == 19) {
      setFailed(true);
      return;
    }
    if (totalCorrect == 10) {
      setEnded(true);
      if (
        totalCorrect == 10 &&
        !leaderboard.includes(user?._id) &&
        members.length > 1
      ) {
        const ranking = leaderboard.length + 1;
        // addScore({ score: Math.ceil(10 / ranking) });
      }
      axios
        .post("/api/pusher/end-game", {
          channel: channelCode,
          user_id: user?._id,
          timestamp: new Date(),
        })
        .catch(console.error);
    }
  }, [
    questionIndex,
    statistics,
    user,
    members.length,
    ended,
    // addScore,
    totalCorrect,
    channelCode,
    leaderboard,
  ]);

  const minWidth = React.useMemo(() => {
    if (members.length > 10) {
      return "300px";
    } else {
      return "450px";
    }
  }, [members]);
  if (!questions || isLoading) return <CircularProgress />;
  return (
    <>
      <Head>
        <title>PracticeMe - Multi player</title>
      </Head>
      <Stack
        direction="row"
        position="absolute"
        alignItems={"center"}
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100vw",
          minHeight: "100vh",
          justifyContent: "space-around",
          // maxWidth: "95%",
          // width: "500px",
          overflow: isMobile ? "hidden" : undefined,
          zIndex: 1,
        }}
      >
        {questions && (
          <>
            <Stack sx={{ height: "100%" }} gap={2}>
              {members.length <= 10 &&
                members.map((member) => {
                  let index = -1;
                  if (member.percentage === 100) {
                    index = leaderboard.findIndex((m) => m === member.id);
                  }
                  return (
                    <ProgressBar
                      minWidth={minWidth}
                      key={member.id}
                      name={
                        member.id === user?._id
                          ? member.name + " (You)"
                          : member.name
                      }
                      percentage={member.percentage}
                      index={index}
                    />
                  );
                })}
              {members.length > 10 &&
                members.slice(0, 5).map((member) => {
                  let index = -1;
                  if (member.percentage === 100) {
                    index = leaderboard.findIndex((m) => m === member.id);
                  }
                  return (
                    <ProgressBar
                      minWidth={minWidth}
                      key={member.id}
                      name={
                        member.id === user?._id
                          ? member.name + " (You)"
                          : member.name
                      }
                      percentage={member.percentage}
                      index={index}
                    />
                  );
                })}
            </Stack>
            <Stack sx={{ height: "100%" }} gap={2}>
              <Stack direction="row" justifyContent={"space-between"}>
                <Typography fontWeight="bold">
                  Question {questionIndex + 1}
                </Typography>
                <Typography>
                  Topic{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {
                      TOPICS[
                        questions[questionIndex]?.topic as keyof typeof TOPICS
                      ]
                    }
                  </span>
                </Typography>
              </Stack>
              <CodeSnippet question={questions[questionIndex]?.question} />
              <Stack
                minWidth={minWidth}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (ended) return;
                  if (answerInput === "") return;
                  handleNext();
                }}
                sx={{ mt: "1rem" }}
                component={"form"}
                alignItems="center"
                direction="row"
                gap={2}
              >
                <TextField
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  fullWidth
                  disabled={ended || failed}
                  autoFocus
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  label="Answer"
                  variant="outlined"
                />
                {!ended ? (
                  <Button
                    disabled={ended || failed}
                    type="submit"
                    variant="contained"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      router.push("/singlestatistics").catch(console.error);
                    }}
                  >
                    View Statistics
                  </Button>
                )}
              </Stack>
            </Stack>
            <Stack sx={{ height: "100%" }} gap={2}>
              {members.length > 10 &&
                members.slice(5, members.length).map((member) => {
                  let index = -1;
                  if (member.percentage === 100) {
                    index = leaderboard.findIndex((m) => m === member.id);
                  }
                  return (
                    <ProgressBar
                      minWidth={minWidth}
                      key={member.id}
                      name={
                        member.id === user?._id
                          ? member.name + " (You)"
                          : member.name
                      }
                      percentage={member.percentage}
                      index={index}
                    />
                  );
                })}
            </Stack>
          </>
        )}
      </Stack>
      {ended && <Confetti />}
    </>
  );
};

export default MultiGame;
