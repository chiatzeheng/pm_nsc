import { Divider, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  accuracies: {
    Operations: number;
    Selection: number;
    Repetition: number;
    Arrays: number;
    Functions: number;
  };
};

const TopicPercentage = (props: Props) => {
  const sortedPercentages = React.useMemo(
    () =>
      Object.entries(props.accuracies)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}),
    [props.accuracies]
  );
  return (
    <Stack
      direction="row"
      width="100%"
      gap={4}
      alignItems={"center"}
      justifyContent="center"
      position="relative"
    >
      <Stack gap={1}>
        <Typography fontWeight={"bold"}>Categories</Typography>
        <Divider />
        {Object.keys(sortedPercentages).map((category, i) => (
          <Typography textAlign="right" key={i}>
            {category}
          </Typography>
        ))}
      </Stack>
      <Stack gap={1}>
        <Typography fontWeight={"bold"}>Percentage</Typography>
        <Divider />
        {Object.values(sortedPercentages).map((unknown_percentage, i) => {
          const percentage = unknown_percentage as number;
          return (
            <Typography textAlign="left" key={i}>
              {percentage.toFixed(2)}%
            </Typography>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default TopicPercentage;
