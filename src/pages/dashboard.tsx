import EventsBanner from "@/components/EventsBanner";
import LeaderboardBanner from "@/components/LeaderboardBanner";
import StatisticsBanner from "@/components/StatisticsBanner";
import WelcomeBanner from "@/components/WelcomeBanner";
import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";
import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import React from "react";

const Dashboard = () => {
  const utils = api.useContext();
  const isMobile = useMediaQuery("(max-width: 800px)");
  const { resetStatistics } = useGlobalContext();
  React.useEffect(() => {
    resetStatistics();
  }, [resetStatistics]);
  const [showUpdateBanner, setShowUpdateBanner] = React.useState(true);
  React.useEffect(() => {
    utils.invalidate().catch(console.error);
  }, [utils]);
  React.useEffect(() => {
    const update = localStorage.getItem("update-2023-05-01");
    if (update === "false") {
      setShowUpdateBanner(false);
    } else {
      setShowUpdateBanner(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>PracticeMe - Dashboard</title>
      </Head>
      <Box m="1rem 2.5rem 1.5rem" p="auto">

        <Box
          display="grid"
          gridTemplateColumns={`repeat(${isMobile ? 1 : 12}, 1fr)`}
          gridTemplateRows={isMobile ? "repeat(3, 1fr)" : "repeat(1, 1fr)"}
          // gridAutoRows="180px"
          gap="20px"
          sx={{
            "& > div": {
              gridColumn: isMobile ? "span 12" : undefined,
            },
          }}
        >
          <LeaderboardBanner />
          <EventsBanner />
          <StatisticsBanner />
          <WelcomeBanner />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
