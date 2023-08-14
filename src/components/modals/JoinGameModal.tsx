import { Login } from "@mui/icons-material";
import { Button, Dialog, TextField, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  joinGameModalOpen: boolean;
  setJoinGameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const JoinGameModal = ({ joinGameModalOpen, setJoinGameModalOpen }: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const [codeInput, setCodeInput] = React.useState("");
  return (
    <Dialog
      open={joinGameModalOpen}
      onClose={() => {
        setJoinGameModalOpen(false);
      }}
    >
      <Stack padding="2rem" gap={2}>
        <Typography
          color={theme.palette.primary.main}
          fontSize={"1.5rem"}
          fontWeight="bold"
        >
          Join room
        </Typography>
        <Stack
          component={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            router
              .push({
                pathname: `/multiplayer`,
                query: {
                  code: codeInput,
                },
              })
              .catch(console.error);
            setJoinGameModalOpen(false);
            setCodeInput("");
          }}
          direction="row"
          gap={2}
        >
          <TextField
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            label="Room"
            variant="outlined"
            autoFocus={true}
          />
          <Button type="submit" endIcon={<Login />} variant="contained">
            Join
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default JoinGameModal;
