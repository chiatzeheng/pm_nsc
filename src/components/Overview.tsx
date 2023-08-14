import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

import type { CategoryTypes } from "@/utils/topics";
import { api } from "@/utils/api";
import CLASSES from "@/utils/classes";
import toast from "react-hot-toast";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Overview = () => {
  const [classValue, setClassValue] = React.useState("ALL");
  const [courseValue, setCourseValue] = React.useState("ALL");

  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");

  // const { data: totalCorrectQuestions, isLoading: isLoadingTotalCorrect } =
  //   api.data.getTotalCorrectQuestions.useQuery();
  // const { data: totalAnsweredQuestions, isLoading: isLoadingTotalAnswered } =
  //   api.data.getTotalQuestionsAnswered.useQuery();
  // const { data: overallStatistics, isLoading: isLoadingOverallStatistics } =
  //   api.data.getOverallStatistics.useQuery();
  // const { data: totalUsers, isLoading: isLoadingTotalUsers } =
  //   api.data.getTotalUsers.useQuery();
  // const { data: mostQuestionsAnswered, isLoading: isLoadingMostQuestions } =
  //   api.data.getMostQuestionsAnswered.useQuery();

  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    refetch,
  } = api.data.getOverviewByClass.useQuery({
    class: courseValue === "ALL" ? undefined : classValue,
    course: courseValue === "ALL" ? undefined : courseValue,
  });

  const refreshPage = async () => {
    try {
      await refetch();
      // toast.success("Update successful", {
      //   icon: "🎉",
      //   duration: 2000,
      // });
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(err);
      toast.error(message, {
        icon: "🤔",
        duration: 6000,
      });
    }
  };

  React.useEffect(() => {
    void refreshPage();
  }, [classValue, courseValue]);

  const correctAndWrong = React.useMemo(() => {
    if (isLoadingOverview || !overviewData) return [0, 0];
    const correct = overviewData.totalCorrectQuestions;
    const wrong =
      overviewData.totalQuestionsAnswered - overviewData.totalCorrectQuestions;
    return [correct, wrong];
  }, [overviewData, isLoadingOverview]);

  const pieData = {
    labels: ["Correct", "Incorrect"],

    datasets: [
      {
        data: correctAndWrong,
        label: "Questions",
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const categoryLabels = React.useMemo(() => {
    if (isLoadingOverview || !overviewData) return [];
    return Object.keys(overviewData.accuracyByCategory);
  }, [isLoadingOverview, overviewData]);

  const categoryAccuracy = React.useMemo(() => {
    if (isLoadingOverview || !overviewData) return [];
    return Object.values(overviewData.accuracyByCategory);
  }, [isLoadingOverview, overviewData]);

  const mostCorrectCategory = React.useMemo(() => {
    if (
      isLoadingOverview ||
      !overviewData?.accuracyByCategory ||
      Object.keys(overviewData.accuracyByCategory).length === 0
    )
      return "";
    const category = Object.keys(overviewData.accuracyByCategory).reduce(
      (a, b) => {
        if (
          overviewData.accuracyByCategory[a] === undefined ||
          overviewData.accuracyByCategory[b] === undefined
        )
          return "";
        return (overviewData.accuracyByCategory[a] || 0) >
          (overviewData.accuracyByCategory[b] || 0)
          ? a
          : b;
      }
    );
    // console.log("lolcaat", category);
    return category;
  }, [isLoadingOverview, overviewData]);

  const mostIncorrectCategory = React.useMemo(() => {
    if (
      isLoadingOverview ||
      !overviewData?.accuracyByCategory ||
      Object.keys(overviewData.accuracyByCategory).length === 0
    )
      return "";
    const category = Object.keys(overviewData.accuracyByCategory).reduce(
      (a, b) => {
        if (
          overviewData.accuracyByCategory[a] === undefined ||
          overviewData.accuracyByCategory[b] === undefined
        )
          return "";
        return (overviewData.accuracyByCategory[a] || 0) <
          (overviewData.accuracyByCategory[b] || 0)
          ? a
          : b;
      }
    );
    return category;
  }, [isLoadingOverview, overviewData]);

  // pie chart options move legend below chart

  const pieOptions = {
    responsive: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "% of Accuracy",
        data: categoryAccuracy,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const barOptions = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Horizontal Bar Chart",
      },
    },
    scales: {
      x: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems={"center"}
        maxWidth={"100%"}
        marginLeft={"1rem"}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          marginRight={"1rem"}
        >
          Course
        </Typography>
        <FormControl
          variant="standard"
          required
          sx={{ marginRight: "2rem", fontSize: 500 }}
        >
          {/* <InputLabel>Course</InputLabel> */}
          <Select
            required
            value={courseValue}
            label="Course"
            onChange={(e) => {
              if (e.target.value === "ALL") setClassValue("ALL");
              else setClassValue("1A/01");
              setCourseValue(e.target.value);
            }}
          >
            <MenuItem value={"ALL"}>ALL</MenuItem>
            <MenuItem value={"DIT"}>DIT</MenuItem>
            <MenuItem value={"DISM"}>DISM</MenuItem>
            <MenuItem value={"DAAA"}>DAAA</MenuItem>
            <MenuItem value={"DCITP"}>DCITP</MenuItem>
          </Select>
        </FormControl>
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          marginRight={"1rem"}
        >
          Class
        </Typography>

        <FormControl variant="standard" required>
          <Select
            required
            value={classValue}
            label="Class"
            onChange={(e) => {
              setClassValue(e.target.value);
            }}
          >
            {courseValue === "ALL" ? (
              <MenuItem value={"ALL"} disabled>
                ALL
              </MenuItem>
            ) : (
              CLASSES[courseValue as "DIT" | "DISM" | "DAAA" | "DCITP"].map(
                (c) => {
                  return (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  );
                }
              )
            )}
          </Select>
        </FormControl>
      </Box>

      <Box
        display={"grid"}
        // gridTemplateColumns={isNonMediumScreen ? "33% 33% 33%" : "100%"}
        gridTemplateColumns={
          isNonMediumScreen
            ? "repeat(3, 33.33%)"
            : "repeat(auto-fit, minmax(100%, 1fr))"
        }
        // gridTemplateColumns={`repeat(${isNonMediumScreen ? 3 : 1}, 33.33%)`}
        // gridTemplateColumns={isNonMediumScreen ? "auto auto auto" : "auto"}
        // // gridTemplateColumns={"1fr"}
        // // gridTemplateRows="repeat(3, 180px)"
        // // gridAutoRows="180px"

        // sx={{
        //   overflowWrap: "anywhere",
        //   // textAlign: "center",
        //   // "& > div": {
        //   //   gridColumn: isNonMediumScreen ? undefined : "span 12",
        //   // },
        // }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            margin: 2,

            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box textAlign="start">
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Overall Correctness
            </Typography>
          </Box>
          <Box alignSelf={"center"} mt={"2%"}>
            <Pie
              // width={"800px"}

              height={"300px"}
              data={pieData}
              options={pieOptions}
            />
          </Box>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            margin: 2,
            gridColumn: isNonMediumScreen ? "span 2" : "span 3",
          }}
        >
          <Box textAlign="start">
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Summary
            </Typography>
          </Box>

          <Box
            display="grid"
            // gridTemplateColumns={`repeat(${isNonMediumScreen ? 2 : 1}, 50%)`}
            gridTemplateColumns={isNonMediumScreen ? "repeat(2, 50%)" : "1fr"}
            // gridAutoRows="180px"

            sx={{
              textAlign: "center",
              // "& > div": {
              //   gridColumn: isNonMediumScreen ? undefined : "span 12",
              // },
            }}
          >
            <List
              sx={{
                width: "100%",
                maxWidth: "90%",
                bgcolor: "background.paper",
              }}
              component="nav"
              aria-label="mailbox folders"
            >
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Lifetime Total"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>

                <Box>
                  {/* <ListItemText primary={totalAnsweredQuestions || 0} /> */}
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? overviewData.totalQuestionsAnswered
                        : 0
                    }
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Lifetime Correct"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? overviewData.totalCorrectQuestions
                        : 0
                    }
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Lifetime Incorrect"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? overviewData.totalQuestionsAnswered -
                          overviewData.totalCorrectQuestions
                        : 0
                    }
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Lifetime Accuracy"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? `${
                            Math.round(
                              (overviewData.totalCorrectQuestions /
                                overviewData.totalQuestionsAnswered) *
                                10000
                            ) / 100 || 0
                          } %`
                        : "0 %"
                    }
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Total Users"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>

                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? overviewData.totalUsers
                        : 0
                    }
                  />
                </Box>
              </ListItem>
            </List>
            <List
              sx={{
                width: "100%",
                maxWidth: "90%",
                bgcolor: "background.paper",
              }}
              component="nav"
              aria-label="mailbox folders"
            >
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Most Correct Category"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? mostCorrectCategory
                        : ""
                    }
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Most Incorrect Category"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? mostIncorrectCategory
                        : ""
                    }
                  />
                </Box>
              </ListItem>

              <Divider />
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Average Total"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? Math.round(
                            (overviewData.totalQuestionsAnswered /
                              overviewData.totalUsers) *
                              100
                          ) / 100 || 0
                        : 0
                    }
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem
                button
                sx={{
                  margin: "3%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <ListItemText
                    primary="Most Questions Answered"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={
                      !isLoadingOverview && overviewData !== undefined
                        ? overviewData.mostQuestionsAnswered
                        : 0
                    }
                  />
                </Box>
              </ListItem>
            </List>
          </Box>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            margin: 2,
            gridColumn: "span 3",
            width: "98%",
            overflowX: "auto",

            display: "flex",
            flexFlow: "wrap",
          }}
        >
          <Box
            textAlign="start"
            width="100%"
            // gridColumn={isNonMediumScreen ? "span 3" : "span 2"}
          >
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Accuracy by Category
            </Typography>
          </Box>

          {isLoadingOverview || !overviewData ? (
            <CircularProgress />
          ) : (
            <Box
              flex={1}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"center"}
              display={"block"}
              margin={"0 auto"}
            >
              <Box display="inline-block">
                <Bar
                  options={barOptions}
                  data={barData}
                  width={isNonMediumScreen ? "1300%" : "300%"}
                  height={"400px"}
                />
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Overview;
