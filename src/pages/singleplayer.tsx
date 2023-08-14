import React from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Head from "next/head";
import CodeSnippet from "@/components/CodeSnippet";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useGlobalContext } from "@/context";
import { toast } from "react-hot-toast";
import TOPICS from "@/utils/topics";

type Query = {
  difficulty: "beginner" | "intermediate" | "advanced";
  topics: string[];
};

const SinglePlayerPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { updateStastics: updateStatistics } = useGlobalContext();
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [answerInput, setAnswerInput] = React.useState("");

  const { user, isAuth, resetStatistics } = useGlobalContext();
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

  const query = router.query as Query;
  const { data: questions, isLoading } = api.questions.getQuestions.useQuery(
    {
      // user_id: user ? user._id : "",
      num_questions: 10,
      difficulty: query.difficulty,
      topics: Array.isArray(query.topics)
        ? query.topics.map((t) => parseInt(t))
        : [parseInt(query.topics)],
    },
    {
      enabled: !!user,
      staleTime: Infinity,
      retry: false,
    }
  );

  if (!questions || isLoading) return <CircularProgress />;

  const onError = () => {
    window.location.href = "/dashboard";
  };

  const onNext = (correct: boolean, has_reached_max: boolean) => {
    if (correct) toast.success("Correct answer!");
    else toast.error("Wrong answer!");
    if (has_reached_max) {
      toast("You have reached the daily cap for this topic!", {
        icon: "🔥",
      });
    }
  };

  const handleNext = () => {
    if (!questions) return;
    updateStatistics(
      questions[questionIndex]?.topic as number,
      questions[questionIndex]?.id as string,
      answerInput,
      "single",
      query.difficulty,
      questions[questionIndex]?.question as string,
      onError,
      onNext
    );

    if (questionIndex == 9) {
      router.push("singlestatistics").catch(console.error);
      return;
    }
    setAnswerInput("");
    setQuestionIndex((prev) => prev + 1);
  };

  // format each question so that it breaks to new line to prevent overflow on mobile devices

  return (
    <Box width={"100%"}>
      <Head>
        <title>PracticeMe - Single player</title>
      </Head>

      <Box
        position="absolute"
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // maxWidth: "95%",
          // width: "800px",
          // margin: "auto",
          // mt: "50%",
        }}
      >
        {questions && (
          <>
            <Stack direction="row" justifyContent={"space-between"}>
              <Typography fontWeight="bold">
                Question {questionIndex + 1} / 10
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
              onSubmit={(e) => {
                e.preventDefault();
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
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                label="Answer"
                variant="outlined"
              />
              <Button
                type="submit"
                disabled={questionIndex === 10}
                variant="contained"
              >
                Next
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SinglePlayerPage;
