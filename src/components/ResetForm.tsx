import React from "react";
import {
    Button,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

const ResetForm = () => {
    const { mutate, isLoading } = api.user.sendRequestPasswordEmail.useMutation();
    const [email, setEmail] = React.useState<string | undefined>(undefined);

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email!");
            return;
        }

        mutate(
            {
                email
            },
            {
                onSuccess: (data) => {
                    toast.success(
                        data.message,
                        {
                            icon: "🎉",
                            duration: 6000,
                        }
                    );
                },
                onError: (e) => {
                    toast.error(e.message);
                },
            }
        );
    }

    return (
        <Stack onSubmit={handleSubmit} gap={2} component={"form"}>
            <Typography variant="h3">
                Reset your Password
            </Typography>
            <TextField
                onChange={(e) => setEmail(e.target.value)}
                required
                name="name"
                label="Email"
            />
            
            <Button disabled={isLoading} type="submit" variant="contained">
                Continue
            </Button>
        </Stack>
    );
};

export default ResetForm;
