import React from "react";

import { Close } from "@mui/icons-material";
import {
  Stack,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

type Props = {
  formData: {
    difficulty: "beginner" | "intermediate" | "advanced";
    topics: number[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      difficulty: "beginner" | "intermediate" | "advanced";
      topics: number[];
    }>
  >;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SharedOption = ({ formData, setFormData, setModalOpen }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.topics.includes(parseInt(event.target.value)))
      setFormData({
        ...formData,
        topics: formData.topics.filter(
          (topic) => topic !== parseInt(event.target.value)
        ),
      });
    else
      setFormData({
        ...formData,
        topics: [...formData.topics, parseInt(event.target.value)],
      });
  };
  return (
    <>
      <Stack direction="row" justifyContent={"space-between"}>
        <Typography
          color={theme.palette.primary.main}
          fontSize={"1.5rem"}
          fontWeight="bold"
        >
          Select Difficulty
        </Typography>
        <IconButton onClick={() => setModalOpen(false)}>
          <Close />
        </IconButton>
      </Stack>
      <FormControl>
        <RadioGroup
          value={formData.difficulty}
          onChange={(_, value) =>
            setFormData({
              ...formData,
              difficulty: value as "beginner" | "intermediate" | "advanced",
            })
          }
          sx={{ display: "flex", flexDirection: "row" }}
        >
          <FormControlLabel
            value="beginner"
            control={<Radio />}
            label="Beginner"
          />
          <FormControlLabel
            value="intermediate"
            control={<Radio />}
            label="Intermediate"
          />
          <FormControlLabel
            disabled={true}
            value="advanced"
            control={<Radio />}
            label="Advanced"
          />
        </RadioGroup>
      </FormControl>
      <Stack direction="row" gap={2}>
        <Typography
          color={theme.palette.primary.main}
          fontSize={"1.5rem"}
          fontWeight="bold"
        >
          Select Topics
        </Typography>
        <Button
          onClick={() => {
            setFormData({
              ...formData,
              topics: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            });
          }}
          variant="contained"
        >
          Select all
        </Button>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${isMobile ? 1 : 2}, 1fr)`,
          gap: "1rem",
        }}
      >
        <FormControl onChange={handleChange}>
          <FormLabel>Operations</FormLabel>
          <FormControlLabel
            checked={formData.topics.includes(0)}
            value={0}
            control={<Checkbox />}
            label="Boolean"
          />
          <FormControlLabel
            checked={formData.topics.includes(1)}
            value={1}
            control={<Checkbox />}
            label="Shorthand"
          />
          <FormControlLabel
            checked={formData.topics.includes(2)}
            value={2}
            control={<Checkbox />}
            label="Post/pre in/decrement"
          />
        </FormControl>
        <FormControl onChange={handleChange}>
          <FormLabel>Selection</FormLabel>
          <FormControlLabel
            value={3}
            checked={formData.topics.includes(3)}
            control={<Checkbox />}
            label="If/Else"
          />
          <FormControlLabel
            value={4}
            checked={formData.topics.includes(4)}
            control={<Checkbox />}
            label="Switch"
          />
        </FormControl>
        <FormControl onChange={handleChange}>
          <FormLabel>Repetition</FormLabel>
          <FormControlLabel
            value={5}
            checked={formData.topics.includes(5)}
            control={<Checkbox />}
            label="For"
          />
          <FormControlLabel
            value={6}
            checked={formData.topics.includes(6)}
            control={<Checkbox />}
            label="While"
          />
          <FormControlLabel
            checked={formData.topics.includes(7)}
            value={7}
            control={<Checkbox />}
            label="Do...While"
          />
        </FormControl>
        <FormControl onChange={handleChange}>
          <FormLabel>Arrays</FormLabel>
          <FormControlLabel
            value={8}
            checked={formData.topics.includes(8)}
            control={<Checkbox />}
            label="Length"
          />
          <FormControlLabel
            value={9}
            checked={formData.topics.includes(9)}
            control={<Checkbox />}
            label="Index"
          />
          <FormControlLabel
            checked={formData.topics.includes(10)}
            value={10}
            control={<Checkbox />}
            label="Index Operations"
          />
          <FormControlLabel
            value={11}
            checked={formData.topics.includes(11)}
            control={<Checkbox />}
            label="Methods"
          />
        </FormControl>
        <FormControl onChange={handleChange}>
          <FormLabel>Functions</FormLabel>
          <FormControlLabel
            value={12}
            checked={formData.topics.includes(12)}
            control={<Checkbox />}
            label="Function"
          />
        </FormControl>
      </Box>
    </>
  );
};

export default SharedOption;
