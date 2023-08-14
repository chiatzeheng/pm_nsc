import { Close } from "@mui/icons-material";
import { Dialog, IconButton, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

type Props = {
  infoModalOpen: boolean;
  setInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MultiInfoModal = ({ infoModalOpen, setInfoModalOpen }: Props) => {
  const theme = useTheme();
  return (
    <Dialog open={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
      <Stack gap={2} sx={{ padding: "1.5rem" }}>
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography
            fontWeight={"bold"}
            fontSize="1.5rem"
            color={theme.palette.primary.main}
          >
            How does PvP work?
          </Typography>
          <IconButton onClick={() => setInfoModalOpen(false)}>
            <Close />
          </IconButton>
        </Stack>
        <Typography>
          You can play against your friends or random people. You can create a
          room and share the code with your friends. You can also join a room by
          entering the code.
          <br />
          <br />
          Whoever answers 10 questions first wins!
        </Typography>
      </Stack>
    </Dialog>
  );
};

export default MultiInfoModal;
