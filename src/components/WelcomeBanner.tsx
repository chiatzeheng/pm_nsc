import { useGlobalContext } from "@/context";
import { Box, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import Banner from "./Banner";
import { useMediaQuery } from "@mui/material";

const WelcomeBanner = () => {
  const theme = useTheme();
  const { user } = useGlobalContext();
  const isNonMediumScreen = useMediaQuery("(min-width: 800px)");
  return (
    <Banner
      elevation={6}
      sx={{
        gridColumn: "span 4",
      }}
    >
      <Stack
        sx={
          {
            // marginTop: "6rem",
          }
        }
        maxWidth={isNonMediumScreen ? "70%" : "100%"}
        direction={"row"}
        flexWrap="wrap"
        gap={1}
      >
        <Typography fontSize="2rem">Welcome back, </Typography>
        <Typography
          fontSize="2rem"
          color={theme.palette.primary.main}
          fontWeight={"bold"}
        >
          {user?.name}
        </Typography>
      </Stack>
      <Stack mt="1rem">
        <Typography fontSize="1.25rem">{user?.email}</Typography>
        <Typography fontSize="1.25rem">{user?.school}</Typography>
      </Stack>
      <Box
        position="absolute"
        top={0}
        right={"1rem"}
        visibility={isNonMediumScreen ? "visible" : "hidden"}
        display={"none"}
      >
        <svg
          width="266"
          height="149"
          viewBox="0 0 266 149"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40.3579 87.8724C39.4079 106.621 22.6585 115.227 2.00094 113.716"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="136" cy="19" r="130" fill="#1565c0" />
          <circle cx="56.5" cy="70.5" r="8.5" fill="#0F0F0F" />
          <circle cx="135.5" cy="70.5" r="8.5" fill="#0F0F0F" />
          <path
            d="M86 77C87.6667 79.3333 92.5 82 96.5 82C100.5 82 104.667 79.3333 106.5 77"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M192.536 85.3099C199.298 102.823 187.5 117.5 168.015 124.525"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </Box>
    </Banner>
  );
};

export default WelcomeBanner;
