import { Tab, Tabs, Typography, useTheme } from "@mui/material";
import React from "react";
import Banner from "./Banner";
import ActiveEvents from "./ActiveEvents";
import EventDetail from "./modals/EventDetail";
import type { IEvents } from "@/models/Events";
import UpcomingEvents from "./UpcomingEvents";

const EventsBanner = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState<"active" | "upcoming">(
    "active"
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalDetails, setModalDetails] = React.useState<IEvents>(
    {} as IEvents
  );

  return (
    <>
      <Banner elevation={6} sx={{ gridColumn: "span 4" }}>
        <Typography
          fontWeight={"bold"}
          fontSize="2rem"
          color={theme.palette.primary.main}
        >
          Events
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, value: "active" | "upcoming") => setActiveTab(value)}
        >
          <Tab label="Active" value="active" />
          <Tab label="Upcoming" value="upcoming" />
        </Tabs>
        {activeTab === "active" && (
          <ActiveEvents
            setModalOpen={setModalOpen}
            setModalDetails={setModalDetails}
          />
        )}
        {activeTab === "upcoming" && (
          <UpcomingEvents
            setModalDetails={setModalDetails}
            setModalOpen={setModalOpen}
          />
        )}
      </Banner>
      <EventDetail
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalDetails={modalDetails}
      />
    </>
  );
};

export default EventsBanner;
