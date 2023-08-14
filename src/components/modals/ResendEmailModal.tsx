import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ResendEmailModal({ open, setOpen }: Props) {
    const { mutate, isLoading } = api.user.resendVerificationEmail.useMutation();
    const [email, setEmail] = React.useState("");

    const handleClose = () => {
        setEmail("");
        setOpen(false);
    };

    const handleSubmit = () => {
        if (email.length === 0) {
            toast.error("Please enter an email!");
            return;
        }
        mutate({
          email: email
        },
        {
            onSuccess: (data) => {
                toast.success(data.message, {
                    icon: "🎉",
                    duration: 6000,
                });
                setOpen(false);
            },
            onError: (err) => {
                toast.error(err.message);
            },
        }
        );
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Resend Verification Email</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To resend your verification email, please enter your
                        email address here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
                    <Button disabled={isLoading} onClick={handleSubmit}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
