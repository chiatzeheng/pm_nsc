import React from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import Head from "next/head";
import SPLogo from "@/assets/sp-logo.png";
import {
  Paper,
  Stack,
  Typography,
  useTheme,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import styled from "@emotion/styled";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { api } from "@/utils/api";
import { useMediaQuery } from "@mui/material";

const Banner = styled(Paper)(() => ({
  padding: "1rem",
  paddingRight: "3rem",
  borderTopRightRadius: "999px",
  borderBottomRightRadius: "999px",
  color: "white",
}));

const Login = () => {
  const router = useRouter();
  const theme = useTheme();
  const { isAuth } = useGlobalContext();
  const [tabValue, setTabValue] = React.useState<"login" | "register">("login");
  const { setMode } = useGlobalContext();
  const { message, type } = router.query;
  const { data: totalQuestions } =
    api.data.getTotalQuestionsAnswered.useQuery();
  const { data: totalMembers } = api.data.getTotalUsers.useQuery();
  const { data: mostQuestions } = api.data.getMostQuestionsAnswered.useQuery();
  const isNonMediumScreen = useMediaQuery("(min-width: 800px)");

  if (isAuth) {
    router.push("/dashboard").catch((err) => console.error(err));
  }

  React.useEffect(() => {
    if (!message || !type) return;
    if (message && type == "SUCCESS") {
      toast.success(message as string);
    } else if (message && type == "BAD_REQUEST") {
      toast.error(message as string);
    }
  }, [message, type]);

  return (
    <>
      <Head>
        <title>PracticeMe - Login</title>
      </Head>
      <Stack
        direction="row"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100vh"}
      >
        {/* Info Banners */}
        <Stack
          justifyContent={"center"}
          alignItems="flex-start"
          gap={5}
          sx={{ height: "100vh" }}
          display={isNonMediumScreen ? "flex" : "none"}
        >
          <Banner sx={{ backgroundColor: "#25a18e", width: "200px" }}>
            <Typography whiteSpace={"nowrap"} fontSize={"1.25rem"}>
              Total Members
            </Typography>
            <Typography fontWeight="bold" fontSize="2rem">
              {totalMembers}
            </Typography>
          </Banner>
          <Banner sx={{ backgroundColor: "#004e64" }}>
            <Typography whiteSpace={"nowrap"} fontSize={"1.25rem"}>
              Total Questions Generated
            </Typography>
            <Typography fontWeight="bold" fontSize="2rem">
              {totalQuestions}
            </Typography>
          </Banner>
          <Banner sx={{ backgroundColor: "#ec9192" }}>
            <Typography whiteSpace={"nowrap"} fontSize={"1.25rem"}>
              Most questions answered
            </Typography>
            <Typography fontWeight="bold" fontSize="2rem">
              {mostQuestions}
            </Typography>
          </Banner>
        </Stack>

        {/* Login forms panel */}
        <Stack gap={2} flex={1} justifyContent="center" alignItems="center">
          <Stack direction="row" gap={2}>
            <Typography fontWeight={"bold"} fontSize="2.5rem">
              PracticeMe
            </Typography>
            {theme.palette.mode === "light" ? (
              <IconButton onClick={() => setMode("dark")}>
                <DarkModeOutlined sx={{ fontSize: "25px" }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => setMode("light")}>
                <LightModeOutlined sx={{ fontSize: "25px" }} />
              </IconButton>
            )}
          </Stack>
          <Paper
            elevation={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "1.5rem",
            }}
          >
            <Tabs
              sx={{
                ".MuiTabs-flexContainer": {
                  justifyContent: "center",
                },
              }}
              value={tabValue}
              onChange={(_, new_value: "login" | "register") => {
                setTabValue(new_value);
              }}
            >
              <Tab
                label="Login"
                value={"login"}
                sx={{
                  ".Mui-selected": {
                    color: "white",
                  },
                }}
              />
              <Tab label="Register" value={"register"} />
            </Tabs>
            {tabValue === "login" ? <LoginForm /> : <RegisterForm />}
          </Paper>
          {/* <Image
            style={{
              position: "absolute",
              bottom: 0,
              top: 0,
              height: "100%",
              left: 0,
            }}
            src={SPBuilding}
            alt="SP Building"
          /> */}
          <Image
            style={{
              width: 226,
              height: 50,
              marginTop: "1rem",
              // position: "absolute",
              // top: "1rem",
              // left: "1rem",
            }}
            src={SPLogo}
            alt="SP Logo"
          />
        </Stack>
      </Stack>
    </>
  );
};

export default Login;
