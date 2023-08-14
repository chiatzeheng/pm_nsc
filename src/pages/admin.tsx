import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Head from "next/head";
import Box from "@mui/material/Box";
import Overview from "@/components/Overview";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import Statistics from "@/components/Statistics";
import Events from "@/components/Events";
import Feedback from "@/components/Feedback";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ pt: 3, maxWidth: "100%" }}>{children}</Box>
      )}
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Admin = () => {
  const [value, setValue] = React.useState(0);
  const router = useRouter();
  const { user, isAuth } = useGlobalContext();

  React.useEffect(() => {
    if (!user) return;
    if (!isAuth) {
      router.replace("/authenticate").catch(console.error);
      return;
    }
    if (user.role !== "admin" && user.role !== "superadmin") {
      router.replace("/dashboard").catch(console.error);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuth]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>PracticeMe - Admin Dashboard</title>
      </Head>
      <Box m="0rem" height="100%" overflow="hidden">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Tabs">
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Statistics" {...a11yProps(1)} />
            <Tab label="Events" {...a11yProps(2)} />
            <Tab label="Feedback" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Overview />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Statistics />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Events />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Feedback />
        </TabPanel>
      </Box>
    </>
  );
};

export default Admin;
