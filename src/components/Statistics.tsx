import CLASSES from "@/utils/classes";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { utils, writeFile } from "xlsx";
import React, { useEffect } from "react";
import StatsTable from "./StatsTable";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context";
import ConfirmationDialog from "./ConfirmationDialog";

const Statistics = () => {
  const { user } = useGlobalContext();
  const { mutate: resetAllUsersScores } =
    api.data.resetAllUserScores.useMutation();

  const [courseValue, setCourseValue] = React.useState("ALL");
  const [classValue, setClassValue] = React.useState("ALL");
  const [nameValue, setNameValue] = React.useState("");
  const [nameTemp, setNameTemp] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // const [paginationModel, setPaginationModel] = React.useState({
  //   page: 0,
  //   pageSize: 10,
  // });

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    refetch,
  } = api.data.getLeaderboardByClass.useQuery({
    class: courseValue === "ALL" ? undefined : classValue,
    course: courseValue === "ALL" ? undefined : courseValue,
    name: nameValue === "" ? undefined : nameValue,
    page: page,
    pageSize: pageSize,
  });

  const { mutate: getAllUsers } = api.user.getAllUsers.useMutation();
  const { mutate: resetAllStatistics } =
    api.data.resetAllStatistics.useMutation();

  const [rowCountState, setRowCountState] = React.useState(
    leaderboard?.totalRowCount || 0
  );

  React.useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      leaderboard?.totalRowCount !== undefined
        ? leaderboard?.totalRowCount
        : prevRowCountState
    );
  }, [leaderboard?.totalRowCount, setRowCountState]);

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

  // debounce nameValue using nameTemp

  useEffect(() => {
    const timer = setTimeout(() => {
      setNameValue(nameTemp);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameTemp]);
  const exportToExcel = () => {
    getAllUsers(undefined, {
      onSuccess: (users) => {
        // export to excel
        const data = users.map((user) => {
          const totalStats = Object.entries(user.statistics).reduce(
            (acc, [key, value]) => {
              acc.totalCorrect += value.total_correct;
              acc.totalWrong += value.total_wrong;
              acc.total += value.total;

              acc[key].totalCorrect += value.total_correct;
              acc[key].totalWrong += value.total_wrong;
              acc[key].total += value.total;
              return acc;
            },
            {
              totalCorrect: 0,
              totalWrong: 0,
              total: 0,
              Operations: {
                totalCorrect: 0,
                totalWrong: 0,
                total: 0,
              },
              Selection: {
                totalCorrect: 0,
                totalWrong: 0,
                total: 0,
              },
              Repetition: {
                totalCorrect: 0,
                totalWrong: 0,
                total: 0,
              },
              Arrays: {
                totalCorrect: 0,
                totalWrong: 0,
                total: 0,
              },
              Functions: {
                totalCorrect: 0,
                totalWrong: 0,
                total: 0,
              },
            }
          );
          return {
            id: user._id,
            name: user.name,
            class: user.class,
            course: user.course,
            role: user.role,
            score: user.score,
            totalCorrect: totalStats.totalCorrect,
            totalWrong: totalStats.totalWrong,
            total: totalStats.total,
            OperationsTotalCorrect: totalStats.Operations.totalCorrect,
            OperationsTotalWrong: totalStats.Operations.totalWrong,
            OperationsTotal: totalStats.Operations.total,
            SelectionTotalCorrect: totalStats.Selection.totalCorrect,
            SelectionTotalWrong: totalStats.Selection.totalWrong,
            SelectionTotal: totalStats.Selection.total,
            RepetitionTotalCorrect: totalStats.Repetition.totalCorrect,
            RepetitionTotalWrong: totalStats.Repetition.totalWrong,
            RepetitionTotal: totalStats.Repetition.total,
            ArraysTotalCorrect: totalStats.Arrays.totalCorrect,
            ArraysTotalWrong: totalStats.Arrays.totalWrong,
            ArraysTotal: totalStats.Arrays.total,
            FunctionsTotalCorrect: totalStats.Functions.totalCorrect,
            FunctionsTotalWrong: totalStats.Functions.totalWrong,
            FunctionsTotal: totalStats.Functions.total,
          };
        });
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Students");
        writeFile(wb, "PracticeMe Students.xlsx");
      },
    });
  };

  const onResetStatisticsHandler = () => {
    if (user !== undefined && user.role !== "superadmin") {
      toast.error("You do not have access to this feature.");
      return;
    }

    resetAllStatistics(undefined, {
      onSuccess: (data) => {
        toast.success("Statistics have been reset!", {
          icon: "🎉",
          duration: 6000,
        });
        void refetch();
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <ConfirmationDialog
        text="Are you sure? To proceed, please type:"
        password="yes i am"
        hint="yes i am"
        open={dialogOpen}
        setOpen={setDialogOpen}
        onConfirm={onResetStatisticsHandler}
      />
      <Box
        display="flex"
        flexWrap={"wrap"}
        flexDirection="row"
        alignItems={"center"}
        marginBottom={"1rem"}
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

        <FormControl
          variant="standard"
          required
          sx={{ marginRight: "2rem", fontSize: 500 }}
        >
          {/* <InputLabel>Class</InputLabel> */}
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
        <FormControl
          sx={{
            width: "20rem",
            mt: { xs: 2, sm: 0 },
          }}
        >
          <TextField
            id="outlined-search"
            label="Name"
            type="search"
            variant="outlined"
            value={nameTemp}
            onChange={(e) => {
              setNameTemp(e.target.value);
              // nameTemp.current = e.target.value;
            }}
          />
        </FormControl>
        <Box>
          <Button variant="contained" sx={{ ml: 4 }} onClick={exportToExcel}>
            Export to Excel
          </Button>
          {user && user.role === "superadmin" && (
            <Button
              color="error"
              variant="contained"
              sx={{ ml: 4 }}
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to reset all statistics?"
                );
                if (confirm) setDialogOpen(true);
              }}
            >
              Reset All Statistics
            </Button>
          )}
          {user && user.role === "superadmin" && (
            <Button
              color="error"
              variant="contained"
              sx={{ ml: 4 }}
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to reset all users scores?"
                );
                if (confirm)
                  resetAllUsersScores(undefined, {
                    onSuccess: () => {
                      refetch();
                    },
                  });
              }}
            >
              Reset All Scores
            </Button>
          )}
        </Box>
      </Box>
      <StatsTable
        leaderboard={leaderboard?.stats || []}
        isLoadingLeaderboard={isLoadingLeaderboard}
        refetch={refreshPage}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        rowCountState={rowCountState}
      />
    </Box>
  );
};

export default Statistics;
