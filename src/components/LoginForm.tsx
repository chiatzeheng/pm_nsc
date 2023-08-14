import { api } from "@/utils/api";
import { Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import ResetPasswordModal from "./modals/ResetPasswordModal";

const LoginForm = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const { isLoading, mutate } = api.user.login.useMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData, {
      onError: (err) => {
        toast.error(err.message, {
          duration: 6000,
        });
      },
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        toast("Logged in successfully!", {
          icon: "🎉",
        });
        window.location.href = "/dashboard";
      },
    });
  };
  return (
    <Stack gap={2} onSubmit={handleSubmit} component={"form"}>
      <TextField
        required
        type="email"
        name="email"
        onChange={handleChange}
        label="IChat Email"
      />
      <TextField
        required
        name="password"
        onChange={handleChange}
        label="Password"
        type="password"
      />
      <Typography sx={{ cursor: "pointer", textDecoration: "underline" }} onClick={handleClickOpen} variant="caption">
        Forget Password?
      </Typography>
      <Button disabled={isLoading} type="submit" variant="contained">
        Login
      </Button>
      <ResetPasswordModal open={open} setOpen={setOpen}/>
    </Stack>
  );
};

export default LoginForm;
