import React from "react";
import { api } from "@/utils/api";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { IEvents } from "@/models/Events";

type props = {
  setModalOpen: (open: boolean) => void;
  setModalDetails: React.Dispatch<React.SetStateAction<IEvents>>;
};

const UpcomingEvents = ({ setModalOpen, setModalDetails }: props) => {
  const { data: UpcomingEvents } = api.event.getUpcomingEvents.useQuery();
  if (UpcomingEvents && UpcomingEvents.length === 0)
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        No upcoming events!
      </Typography>
    );
  return (
    <TableContainer>
      <TableHead>
        <TableRow>
          <TableCell>Event</TableCell>
          <TableCell>Start</TableCell>
          <TableCell>End</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {UpcomingEvents?.map((event) => {
          return (
            <TableRow key={event._id}>
              <TableCell>{event.eventname}</TableCell>
              <TableCell>
                {new Date(event.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(event.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setModalDetails(event);
                  setModalOpen(true);
                }}
              >
                More info
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableContainer>
  );
};

export default UpcomingEvents;
