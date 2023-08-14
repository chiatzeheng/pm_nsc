import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";
import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import Script from "next/script";

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  const router = useRouter();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(!isNonMobile);
  const { data: user, isLoading } = api.user.getMe.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });
  const { setIsLoading, setIsAuth, setUser } = useGlobalContext();
  React.useEffect(() => {
    if (
      !user &&
      !isLoading &&
      router.pathname !== "/authenticate" &&
      router.pathname !== "/reset-password" &&
      router.pathname !== "/reset-password/[token]" &&
      router.pathname !== "/verify-email"
    ) {
      router.replace("/authenticate").catch((err) => console.error(err));
      return;
    }
    setIsAuth(!!user);
    setUser(user);
    setIsLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, setIsAuth, setUser, setIsLoading]);
  if (isLoading) {
    return <></>;
  }
  if (!isLoading && !!user) {
    return (
      <>
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${
            process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string
          }`}
        />

        <Script strategy="lazyOnload" id="">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${
          process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string
        }', {
        page_path: window.location.pathname,
        });
    `}
        </Script>
        <Box
          width="100%"
          minHeight="100vh"
          display={isNonMobile ? "flex" : "block"}
        >
          <Sidebar
            drawerWidth={isSidebarOpen ? 280 : 0}
            isNonMobile={isNonMobile}
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />
          <Box width="100%">
            <Navbar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            {props.children}
          </Box>
        </Box>
      </>
    );
  } else {
    return <Box height="100%">{props.children}</Box>;
  }
};

export default Layout;
