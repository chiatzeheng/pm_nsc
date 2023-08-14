import { api } from "@/utils/api";
import { Chip, CircularProgress, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import Banner from "./Banner";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import TopicPercentage from "./TopicPercentage";
import { useMediaQuery } from "@mui/material";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const StatisticsBanner = () => {
  const { data, isLoading } = api.user.getDashboardStatistics.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const isNonMediumScreen = useMediaQuery("(min-width: 1100px)");

  const radarData = React.useMemo(() => {
    if (!data) return;
    return {
      labels: ["Operations", "Selection", "Repetition", "Arrays", "Functions"],
      datasets: [
        {
          label: "% of Accuracy",
          data: Object.values(data?.accuracies).map((a) => a),
          backgroundColor: "rgba(21, 101, 192, 0.4)",
          borderColor: "rgba(21, 101, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [data]);
  if (!data || !radarData || isLoading) {
    return <CircularProgress />;
  }
  return (
    <Banner elevation={6} sx={{ gridColumn: "span 8", gridRow: "span 1" }}>
      <Stack direction="row" justifyContent={"space-around"} mb="4rem">
        <Stack alignItems={"center"}>
          <Chip color="primary" label="Total Correct" />

          <Typography fontWeight={"bold"}>
            {data?.totalCorrectQuestions}
          </Typography>
        </Stack>
        <Stack alignItems={"center"} mx={"1%"}>
          <Chip color="primary" label="Total Questions" />
          <Typography fontWeight={"bold"}>
            {data?.totalAttemptedQuestions}
          </Typography>
        </Stack>
        <Stack alignItems={"center"}>
          <Chip color="primary" label="Overall Accuracy" />
          <Typography fontWeight={"bold"}>
            {data?.totalCorrectQuestions &&
              data?.totalAttemptedQuestions &&
              (data?.totalAttemptedQuestions !== 0
                ? (
                    (data?.totalCorrectQuestions /
                      data?.totalAttemptedQuestions) *
                    100
                  ).toFixed(2) + "%"
                : 0)}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent="space-around"
        flexWrap="wrap"
        display="grid"
        gridTemplateColumns={`repeat(${isNonMediumScreen ? 2 : 1}, 1fr)`}
        // gridTemplateRows={
        //   isNonMediumScreen ? "repeat(3, 1fr)" : "repeat(2, 1fr)"
        // }
        // gridAutoRows="180px"
        gap="20px"
      >
        <Box justifyContent="center" alignItems="center" display={"flex"}>
          <Radar
            width="450px"
            height="350px"
            data={radarData}
            options={{
              responsive: false,
              plugins: {
                legend: {
                  labels: {
                    // This more specific font property overrides the global property
                    font: {
                      size: 16,
                    },
                  },
                },
              },
              scales: {
                r: {
                  angleLines: {
                    display: false,
                  },
                  suggestedMin: 0,
                  suggestedMax: 100,
                },
              },
            }}
          />
        </Box>

        <TopicPercentage accuracies={data?.accuracies} />
      </Stack>
    </Banner>
  );
};

export default StatisticsBanner;
