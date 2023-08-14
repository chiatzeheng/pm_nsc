import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";
import { Box, Button, Paper, Typography, useMediaQuery } from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";

const VerifyEmailPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { mutate } = api.user.verifyEmail.useMutation();
  const { isAuth } = useGlobalContext();
  React.useEffect(() => {
    if (isAuth) {
      router.replace("/dashboard").catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);
  const onSubmit = () => {
    mutate(
      { token: token as string },
      {
        onSuccess: (result) => {
          toast.success(result.message);
          router
            .replace(
              `${
                process.env.NEXT_PUBLIC_API_URL as string
              }/authenticate?message=${result.message}&type=${result.code}`
            )
            .catch(console.error);
        },
        onError: (err) => {
          toast.error(err.message);
          console.error(err);
        },
      }
    );
  };
  return (
    <Stack
      height="100vh"
      alignItems={"center"}
      direction={"row"}
      justifyContent="center"
    >
      <Paper
        sx={{
          padding: "1rem",
          maxWidth: isNonMobile ? "40%" : undefined,
          position: "relative",
        }}
      >
        <Stack gap={2}>
          <Stack direction={"row"} alignItems="center">
            <Typography fontWeight={"bold"}>
              Last step before you begin your JavaScript mastery journey!
            </Typography>

            <Box alignSelf="flex-end">
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
          </Stack>
          <Button onClick={onSubmit} variant="contained">
            Verify Email
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default VerifyEmailPage;
