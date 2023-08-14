import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { AppProvider, useGlobalContext } from "../context";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "../theme";
import Layout from "../components/Layout";
import React from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const WrappedApp = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useGlobalContext();
  return (
    <ThemeProvider theme={createTheme(themeSettings(mode))}>
      <Toaster />
      <CssBaseline />
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <WrappedApp>
        <Component {...pageProps} />
      </WrappedApp>
    </AppProvider>
  );
};

export default api.withTRPC(MyApp);
