import { innerStatisticType, statisticType, useGlobalContext } from "@/context";
import { Box } from "@mui/system";
import { getCategory, getTopic } from "@/utils/topics";
import type { CategoryTypes } from "@/utils/topics";
import type TOPICS from "@/utils/topics";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import Paper from "@mui/material/Paper";
import ReplayIcon from "@mui/icons-material/Replay";

import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  Title,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import LinearProgressWithLabel from "@/components/LinearProgressWithLabel";
import HistoryTable from "@/components/HistoryTable";
import { ChevronLeft } from "@mui/icons-material";
import { api } from "@/utils/api";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const SingleStatistics = () => {
  const isNonMediumScreen = useMediaQuery("(min-width: 800px)");
  const util = api.useContext();

  const router = useRouter();
  const {
    statistics,
    history,
    getTotalQuestions,
    isAuth,
    getTotalCorrect,
    isLoading,
  } = useGlobalContext();
  const [isLoadingRetry, setIsLoadingRetry] = React.useState(false);

  // const { mutate: updateQuestionLog } =
  //   api.user.updateQuestionLog.useMutation();

  // React.useEffect(() => {
  //   if (isLoading) return;

  //   console.log(statistics);

  //   console.log(
  //     Object.keys(statistics).reduce((acc, cur) => {
  //       return {
  //         ...acc,
  //         [cur]: statistics[cur as unknown as keyof typeof statistics].total,
  //       };
  //     }, {})
  //   );

  //   updateQuestionLog(
  //     Object.keys(statistics).reduce((acc, cur) => {
  //       return {
  //         ...acc,
  //         [cur]: statistics[cur as unknown as keyof typeof statistics].total,
  //       };
  //     }, {})
  //   );
  // }, [isLoading]);

  if (getTotalQuestions(statistics) === 0) {
    if (isAuth) {
      router.replace("/dashboard").catch(console.error);
    } else {
      router.replace("/authenticate").catch(console.error);
    }
  }
  const sortedStatistics = React.useMemo(() => {
    return Object.keys(statistics).sort((a, b) => {
      return (
        statistics[b as unknown as keyof typeof statistics].total_correct -
        statistics[a as unknown as keyof typeof statistics].total_correct
      );
    });
  }, [statistics]);

  React.useEffect(() => {
    util.questions.getQuestions.invalidate().catch(console.error);
  }, [util.questions.getQuestions]);
  // sort statistics by categories

  const statsByCategory = React.useMemo(() => {
    const statsByCategory = {
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
    };

    Object.keys(statistics).map((ti) => {
      const topic_index = ti as unknown as keyof typeof TOPICS;
      // console.log(getCategory(topic_index));
      if (!statsByCategory.hasOwnProperty(getCategory(topic_index))) {
        statsByCategory[getCategory(topic_index)] = {
          total_correct: 0,
          total_wrong: 0,
          total: 0,
        };
      }
      statsByCategory[getCategory(topic_index)].total_correct +=
        statistics[topic_index].total_correct;

      statsByCategory[getCategory(topic_index)].total_wrong +=
        statistics[topic_index].total_wrong;

      statsByCategory[getCategory(topic_index)].total +=
        statistics[topic_index].total;
    });

    Object.keys(statsByCategory).map((key) => {
      if (statsByCategory[key as CategoryTypes].total === 0) {
        delete statsByCategory[key as CategoryTypes];
      }
    });

    return statsByCategory;
  }, [statistics]);

  const categoryLabels = Object.keys(statsByCategory);
  const categoryAccuracy = Object.values(statsByCategory).map((category) => {
    return (
      (category.total_correct /
        (category.total_correct + category.total_wrong)) *
      100
    );
  });

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        label: "% of Accuracy",
        data: categoryAccuracy,
        backgroundColor: "rgba(21, 101, 192, 0.4)",
        borderColor: "rgba(21, 101, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const radarOptions = {
    responsive: false,
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Statistics",
      },
    },
    scales: {
      r: {
        pointLabels: {
          font: {
            size: 18,
          },
        },
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Statistics",
      },
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  //   // reset state to default
  //   if (formData.topics.length === 0) {
  //     toast.error("Please select a topic");
  //     return;
  //   }
  //   props.setSinglePlayerModalOpen(false);

  //   router
  //     .push(
  //       {
  //         pathname: "/singleplayer",
  //         query: {
  //           difficulty: formData.difficulty,
  //           topics: formData.topics,
  //         },
  //       },
  //       "/singleplayer"
  //     )
  //     .then(() => {
  //       setFormData({
  //         difficulty: "beginner",
  //         topics: [],
  //       });
  //     })
  //     .catch((e) => console.log(e));
  // }}

  const onRetryHandler = () => {
    if (
      isLoadingRetry ||
      history[0] === undefined ||
      history[0].mode === "multi"
    )
      return;
    setIsLoadingRetry(true);
    const topics = Object.keys(statistics).filter((ti) => {
      const topic_index = ti as unknown as keyof typeof statistics;
      return statistics[topic_index].total !== 0;
    });

    // if (history[0] === undefined) return;

    router
      .push(
        {
          pathname: "/singleplayer",
          query: {
            difficulty: history[0]?.difficulty,
            topics: topics,
          },
        },
        "/singleplayer"
      )
      .then(() => {
        setIsLoadingRetry(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Head>
        <title>PracticeMe - Statistics</title>
      </Head>
      <Box
        margin="0 2.5rem"
        display="flex"
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        {/* {// <Stack direction="row" width="100%" gap={6}> } */}

        <Stack
          direction="row"
          width="100%"
          display="grid"
          gridTemplateColumns={`repeat(${isNonMediumScreen ? 2 : 1}, 1fr)`}
          // gridTemplateRows={
          //   isNonMediumScreen ? "repeat(3, 1fr)" : "repeat(2, 1fr)"
          // }
          // gridAutoRows="180px"
          gap="20px"
          mt={"4rem"}
        >
          <Stack
            width={"100%"}
            justifyContent="center"
            gap={2}
            alignItems="center"
          >
            <Button
              startIcon={<ChevronLeft />}
              onClick={() => {
                router.replace("/dashboard").catch(console.error);
              }}
              variant="contained"
              sx={{
                backgroundColor: "dodgerblue",
                color: "white",
              }}
            >
              Back to dashboard
            </Button>
            {categoryLabels.length >= 3 ? (
              <Radar
                width="500px"
                height="400px"
                data={data}
                style={{ width: "100%" }}
                options={radarOptions}
              />
            ) : (
              <Bar options={barOptions} data={data} height="400px" />
            )}
            <Button
              startIcon={<ReplayIcon />}
              onClick={onRetryHandler}
              variant="contained"
              sx={{
                mt: "1rem",
                backgroundColor: "dodgerblue",
                color: "white",
                visibility: history[0]?.mode === "multi" ? "hidden" : "visible",
              }}
            >
              Retry
            </Button>
          </Stack>
          <Box sx={{ width: "100%" }}>
            <Typography fontWeight={"bold"} fontSize="1.25rem" mb="1rem">
              Total correct: {getTotalCorrect(statistics)} /{" "}
              {getTotalQuestions(statistics)}
            </Typography>
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                padding: 2,
                borderRadius: 2,
                backgroundColor: "aliceblue",
              }}
            >
              <Box fontSize={18} width="100%" fontWeight={500}>
                Detailed Summary
              </Box>
            </Paper>

            <Box
              width="100%"
              display="grid"
              gridTemplateColumns={`repeat(${isNonMediumScreen ? 2 : 1}, 1fr)`}
              // gridAutoRows="180px"
              gap="20px"
              sx={{
                "& > div": {
                  gridColumn: isNonMediumScreen ? undefined : "span 2",
                },
              }}
            >
              {Object.keys(sortedStatistics).map((ti) => {
                const topic_index = ti as unknown as keyof typeof statistics;
                if (statistics[topic_index].total === 0) return null;
                return (
                  <Box key={topic_index} margin="1rem 0">
                    <Box fontWeight={800} fontSize={20}>
                      {getTopic(topic_index)}
                    </Box>
                    <Box color={"gray"}>{getCategory(topic_index)}</Box>
                    <Box fontSize={24} fontWeight={500} marginBottom={1}>
                      {statistics[topic_index].total_correct.toString() +
                        " / " +
                        statistics[topic_index].total.toString()}
                    </Box>

                    <LinearProgressWithLabel
                      value={
                        (statistics[topic_index].total_correct /
                          (statistics[topic_index].total_correct +
                            statistics[topic_index].total_wrong)) *
                          100 || 0
                      }
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Stack>
        <HistoryTable />
      </Box>
    </>
  );
};

export default SingleStatistics;
