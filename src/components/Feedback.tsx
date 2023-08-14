import CLASSES from "@/utils/classes";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import StatsTable from "./StatsTable";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import FeedbackTable from "./FeedbackTable";
import { FeedbackCategories } from "@/utils/feedbacks";

const Feedback = () => {
  const [categoryValue, setCategoryValue] = React.useState("All");
  const [subjectValue, setSubjectValue] = React.useState("");
  const [subjectTemp, setSubjectTemp] = React.useState("");
  const [showValue, setShowValue] = React.useState("Active");
  // const [paginationModel, setPaginationModel] = React.useState({
  //   page: 0,
  //   pageSize: 10,
  // });

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const {
    data: feedbackList,
    isLoading: isLoadingFeedbackList,
    refetch,
  } = api.data.getFeedback.useQuery({
    category: categoryValue === "All" ? undefined : categoryValue,
    subject: subjectValue === "" ? undefined : subjectValue,
    page: page,
    pageSize: pageSize,
    archived:showValue,
  });

  const [rowCountState, setRowCountState] = React.useState(
    feedbackList?.totalRowCount || 0
  );

  React.useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      feedbackList?.totalRowCount !== undefined
        ? feedbackList?.totalRowCount
        : prevRowCountState
    );
  }, [feedbackList?.totalRowCount, setRowCountState]);

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
      setSubjectValue(subjectTemp);
    }, 500);
    return () => clearTimeout(timer);
  }, [subjectTemp]);

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
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
          Category
        </Typography>
        <FormControl
          variant="standard"
          required
          sx={{ marginRight: "2rem", fontSize: 500 }}
        >
          <Select
            required
            value={categoryValue}
            label="Category"
            onChange={(e) => {
              setCategoryValue(e.target.value);
            }}
          >
            <MenuItem value={"All"}>All</MenuItem>
            {FeedbackCategories.map((category) => {
              return (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              );
            })}

            {/* <MenuItem value={"Bug Report"}>Bug Report</MenuItem>
            <MenuItem value={"Feature Request"}>Feature Request</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem> */}
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
            label="Subject"
            type="search"
            variant="outlined"
            value={subjectTemp}
            onChange={(e) => {
              setSubjectTemp(e.target.value);
              // nameTemp.current = e.target.value;
            }}
          />
        </FormControl>
        <FormControl sx={{
          width: "7rem",
          mt: { xs: 2, sm: 0 },
          mx:{xs:2,sm:2}
        }}>

          <Select
            labelId="Archive"
            id="archive"
            value={showValue}
            onChange={(e) => {
              setShowValue(e.target.value);
            }}
          >
            <MenuItem value={"Active"}>Active</MenuItem>
            <MenuItem value={"Archived"}>Archived</MenuItem>
            <MenuItem value={"All"}>All</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <FeedbackTable
        feedbackList={feedbackList?.feedbackData || []}
        isLoadingFeedbackList={isLoadingFeedbackList}
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

export default Feedback;
