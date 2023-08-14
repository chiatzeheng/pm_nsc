import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import BrownCar from "@/assets/brownCar.svg";
import React from "react";
import { Stack } from "@mui/system";

type Props = {
  percentage: number;
  name: string;
  index: number;
  minWidth: string;
};

function convertPlacing(placing: number) {
  // 1 -> 1st
  // 2 -> 2nd
  // 3 -> 3rd

  if (placing === 1) {
    return "1st";
  }
  if (placing === 2) {
    return "2nd";
  }
  if (placing === 3) {
    return "3rd";
  }
  return `${placing}th`;
}

const ProgressBar = ({ name, percentage, index, minWidth }: Props) => {
  const theme = useTheme();
  return (
    <Box sx={{ width: "100%", position: "relative", minWidth }}>
      <Stack
        direction="row"
        gap={1}
        position="relative"
        alignItems="center"
        sx={{
          transition: "all 0.5s ease",
          left: `${percentage}%`,
        }}
      >
        <Image
          alt="car"
          src={BrownCar as string}
          width={60}
          height={40}
          style={{
            position: "relative",
            bottom: "-5px",
          }}
        ></Image>
        <Typography
          sx={{ position: "relative", top: "0", left: "0" }}
          fontSize="0.8rem"
          color={theme.palette.primary.main}
          fontWeight="bold"
        >
          {name} {index !== -1 && " - " + convertPlacing(index + 1)}{" "}
          <span style={{ color: "gray" }}>{percentage.toString() + "%"}</span>
        </Typography>
      </Stack>
      <Box
        sx={{ width: "100%", mt: "5px", borderBottom: "2px dashed #1565c0" }}
      />
    </Box>
  );
};

export default ProgressBar;
