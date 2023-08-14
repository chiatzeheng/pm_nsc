import { Login, Send } from "@mui/icons-material";
import {
  Button,
  Dialog,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  MenuItem,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";

import { FeedbackCategories, FeedbackCategoryTypes } from "@/utils/feedbacks";

type Props = {
  feedbackModalOpen: boolean;
  setFeedbackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// const feedbackCategories = [
//   {
//     value: "Bug Report",
//     label: "Bug Report",
//   },
//   {
//     value: "Feature Request",
//     label: "Feature Request",
//   },
//   {
//     value: "Other",
//     label: "Other",
//   },
// ];

const feedbackCategories = FeedbackCategories.map((category) => ({
  value: category,
  label: category,
}));

const FeedbackModal = ({ feedbackModalOpen, setFeedbackModalOpen }: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const [categorySelect, setCategorySelect] = React.useState("Bug Report");
  const [subjectInput, setSubjectInput] = React.useState("");
  const [commentInput, setCommentInput] = React.useState("");
  const { mutate, isLoading } = api.user.submitFeedback.useMutation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const onSubmitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (subjectInput === "" || commentInput === "" || categorySelect === "") {
      toast.error("Please fill all required fields");
      return;
    }
    if (subjectInput.length > 50 || commentInput.length > 500) {
      toast.error(
        "Maximum amount of characters has exceeded for Subject or Comment."
      );
      return;
    }
    mutate(
      {
        category: categorySelect as FeedbackCategoryTypes,
        subject: subjectInput,
        comment: commentInput,
      },
      {
        onSuccess: (data) => {
          toast.success("Feedback has been successfully submitted!", {
            icon: "🎉",
            duration: 6000,
          });
          setFeedbackModalOpen(false);
          setSubjectInput("");
          setCommentInput("");
        },
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );
  };
  return (
    <Dialog
      open={feedbackModalOpen}
      onClose={() => {
        setFeedbackModalOpen(false);
      }}
      fullWidth
    >
      <Stack padding="2rem" gap={2}>
        <Typography
          color={theme.palette.primary.main}
          fontSize={"1.5rem"}
          fontWeight="bold"
        >
          Feedback
        </Typography>
        <Stack component={"form"} onSubmit={onSubmitFeedback} gap={2}>
          <TextField
            id="outlined-select-category"
            select
            required
            label="Category"
            value={categorySelect}
            onChange={(e) => setCategorySelect(e.target.value)}
          >
            {feedbackCategories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            required
            label="Subject"
            variant="outlined"
            autoFocus={true}
          />
          <TextField
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            required
            label="Comment"
            multiline
            rows={7}
            variant="outlined"
            autoFocus={true}
          />
          <Button type="submit" endIcon={<Send />} variant="contained">
            Submit
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default FeedbackModal;
