import React from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface ChangePasswordFormProps {
  token: string;
}

const ChangePasswordForm = ({ token }: ChangePasswordFormProps) => {
  const { mutate, isLoading } = api.user.resetPassword.useMutation();
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    mutate(
      {
        token,
        password,
      },
      {
        onSuccess: (data) => {
          window.location.href =
            "/authenticate?message=" + data.message + "&type=SUCCESS";
        },
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );
  };

  return (
    <Stack onSubmit={handleSubmit} gap={2} component={"form"}>
      <Typography variant="h3">Enter new Password</Typography>
      <TextField
        error={password !== confirmPassword}
        onChange={(e) => setPassword(e.target.value)}
        required
        type="password"
        name="name"
        label="Password"
      />
      <TextField
        error={password !== confirmPassword}
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        name="name"
        label="Confirm Password"
      />
      <Button disabled={isLoading} type="submit" variant="contained">
        Change Password
      </Button>
    </Stack>
  );
};

export default ChangePasswordForm;
