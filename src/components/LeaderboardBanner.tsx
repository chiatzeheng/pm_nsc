import { api } from "@/utils/api";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Tab,
  Tabs,
  FormControl,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import React from "react";
import Banner from "./Banner";
import { useGlobalContext } from "@/context";
import type { IUser } from "@/models/User";
import CLASSES from "@/utils/classes";

interface Column {
  id: "name" | "score" | "class" | "school" | "percentage";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface rankColumn {
  id: "schoolName" | "score";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface SchoolData {
  schoolName: string;
  score: number;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 150 },
  { id: "score", label: "Score", minWidth: 80 },
  { id: "percentage", label: "Percentage", minWidth: 80 },
  { id: "school", label: "School", minWidth: 80 },
];

const rankColumns: readonly rankColumn[] = [
  { id: "className", label: "Course - Class", minWidth: 150 },
  { id: "score", label: "Score", minWidth: 80 },
];

const LeaderboardBanner = () => {
  const { user } = useGlobalContext();
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState<
    "global" | "school" | "course" | "rank"
  >("global");
  const [schoolValue, setSchoolValue] = React.useState("ALL");
  const [ranking, setRanking] = React.useState([{}]);

  const { data, isLoading } = api.data.getLeaderboard.useQuery();

  const rows = React.useMemo(() => {
    if (!user) return;
    if (!data) return;
    let filteredData = data;
    if (activeTab === "school") {
      return data.filter((d) => d.school === user.school);
    }

    if (schoolValue !== "ALL") {
      filteredData = filteredData.filter((d) => d.school === schoolValue);
    }

    const schoolData: { [key: string]: SchoolData } = {};

    data.forEach((student) => {
      const { school, score } = student;
      const classKey = `${school} - ${score}`;

      if (!schoolData[classKey]) {
        schoolData[classKey] = {
          className: classKey,
          score: 0,
        };
      }

      schoolData[classKey].score += score;
    });

    const classArray: SchoolData[] = Object.values(schoolData);

    classArray.sort((a, b) => b.score - a.score);
    setRanking(classArray);

    return filteredData;
  }, [data, user, activeTab, schoolValue]) as IUser[];

  if (isLoading || !data) return <CircularProgress />;
  return (
    <Banner elevation={6} sx={{ gridColumn: "span 8", gridRow: "span 1" }}>
      <Typography
        color={theme.palette.primary.main}
        fontWeight="bold"
        fontSize="2rem"
      >
        Leaderboard
      </Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Tabs
          value={activeTab}
          onChange={(_, value: "global" | "rank") =>
            setActiveTab(value)
          }
        >
          <Tab label="Global" value="global" />
          <Tab label="Rank" value="rank" />
        </Tabs>
        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormControl
            variant="standard"
            required
            sx={{
              marginRight: "2rem",
              fontSize: 500,
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
          </FormControl>
          <FormControl
            variant="standard"
            required
            sx={{
              marginRight: "2rem",
              fontSize: 500,
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
            }}
          >

          </FormControl>
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {activeTab != "rank"
                ? columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))
                : rankColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activeTab !== "rank"
              ? rows?.map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      let value;
                      if (column.id === "percentage") {
                        value = 0;
                        if (row.statistics) {
                          const total = Object.values(row.statistics).reduce(
                            (acc, cur) => {
                              return acc + cur.total;
                            },
                            0
                          );
                          const totalCorrect = Object.values(
                            row.statistics
                          ).reduce((acc, cur) => {
                            return acc + cur.total_correct;
                          }, 0);
                          value =
                            total === 0
                              ? "0%"
                              : ((totalCorrect / total) * 100).toFixed(2) + "%";
                        }
                      } else {
                        value = row[column.id];
                      }
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{
                            backgroundColor:
                              row.name === user?.name
                                ? theme.palette.primary.main
                                : undefined,
                            color:
                              row.name === user?.name
                                ? theme.palette.primary.contrastText
                                : undefined,
                            fontWeight:
                              row.name === user?.name ? "bold" : undefined,
                          }}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              : ranking.map((classItem, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {rankColumns.map((column) => {
                      let value = classItem[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Banner>
  );
};

export default LeaderboardBanner;
