import type { IEvents } from "@/models/Events";
import { Dialog, Stack, Typography, useTheme } from "@mui/material";
import React from "react";

type Props = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalDetails: IEvents;
};

const EventDetail = (props: Props) => {
  const theme = useTheme();
  const { modalDetails } = props;
  return (
    <Dialog
      open={props.modalOpen}
      onClose={() => {
        props.setModalOpen(false);
      }}
    >
      <Stack padding="2rem" gap={2}>
        <Typography
          color={theme.palette.primary.main}
          fontSize={"1.5rem"}
          fontWeight="bold"
        >
          {modalDetails.eventname}
        </Typography>
        <Typography color="gray">{modalDetails.description}</Typography>
        <Typography>Topic: {modalDetails.topic}</Typography>
        <Typography>
          Multiplier: {modalDetails.multiplier?.type}{" "}
          {modalDetails.multiplier?.value}
        </Typography>
        <Typography>
          Event Period: {new Date(modalDetails.startDate).toLocaleDateString()}{" "}
          - {new Date(modalDetails.endDate).toLocaleDateString()}
        </Typography>
      </Stack>
    </Dialog>
  );
};

export default EventDetail;
