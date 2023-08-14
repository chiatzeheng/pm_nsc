import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmationDialog({
  text,
  password,
  hint,
  open,
  setOpen,
  onConfirm,
}: {
  text: string;
  password: string;
  hint: string;
  open: boolean;
  setOpen: (set: boolean) => void;
  onConfirm: () => void;
}) {
  const [psw, setPsw] = React.useState("");

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          <DialogContentText>
            <b>{hint}</b>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label=""
            fullWidth
            variant="standard"
            value={psw}
            onChange={(e) => {
              setPsw(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={password !== psw}
            onClick={() => {
              onConfirm();
              setPsw("");
              setOpen(false);
            }}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
