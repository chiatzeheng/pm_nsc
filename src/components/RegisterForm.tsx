import React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import ResendEmailModal from "./modals/ResendEmailModal";
const RegisterForm = () => {
  const [open, setOpen] = React.useState(false);
  const { mutate, isLoading } = api.user.register.useMutation();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
    school: "",
    confirmPassword: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    mutate(
      {
        school: formData.school,
        email: formData.email,
        name: formData.name,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message, {
            icon: "🎉",
            duration: 6000,
          });
        },
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );
  };
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Stack onSubmit={handleSubmit} gap={2} component={"form"}>
      <TextField
        onChange={handleChange}
        required
        label="Email"
        type="email"
        name="email"
      />
      <TextField
        onChange={handleChange}
        required
        name="name"
        label="Full name ( as per NRIC )"
      />
      <FormControl required>
        <InputLabel>School</InputLabel>
        <Select
          required
          value={formData.school}
          label="School"
          onChange={(e) => {
            setFormData({
              ...formData,
              school: e.target.value,
            });
          }}
        >
          <MenuItem value={"ADMIRALTY SECONDARY SCHOOL"}>
            ADMIRALTY SECONDARY SCHOOL
          </MenuItem>
          <MenuItem value={"BUKIT VIEW SECONDARY SCHOOL"}>
            BUKIT VIEW SECONDARY SCHOOL
          </MenuItem>
          <MenuItem value={"CATHOLIC HIGH SCHOOL (SECONDARY)"}>
            CATHOLIC HIGH SCHOOL (SECONDARY)
          </MenuItem>
          <MenuItem value={"COMMONWEALTH SECONDARY SCHOOL"}>
            COMMONWEALTH SECONDARY SCHOOL
          </MenuItem>
          <MenuItem value={"CHIJ ST. NICHOLAS GIRLS' SCHOOL"}>
            CHIJ ST. NICHOLAS GIRLS' SCHOOL
          </MenuItem>
          <MenuItem value={"NATIONAL JUNIOR COLLEGE"}>
            NATIONAL JUNIOR COLLEGE
          </MenuItem>
          <MenuItem value={"ST. PATRICK'S SCHOOL"}>
            ST. PATRICK'S SCHOOL
          </MenuItem>
          <MenuItem value={"XINMIN SECONDARY SCHOOL"}>
            XINMIN SECONDARY SCHOOL
          </MenuItem>
          <MenuItem value={"ZHONGHUA SECONDARY SCHOOL"}>
            ZHONGHUA SECONDARY SCHOOL
          </MenuItem>
          <MenuItem value={"METHODIST GIRLS' SCHOOL (SECONDARY)"}>
            METHODIST GIRLS' SCHOOL (SECONDARY)
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        error={formData.password !== formData.confirmPassword}
        name="password"
        onChange={handleChange}
        required
        label="Password"
        type="password"
      />
      <TextField
        error={formData.password !== formData.confirmPassword}
        name="confirmPassword"
        onChange={handleChange}
        required
        label="Confirm password"
        type="password"
      />
      <Typography
        variant="caption"
        sx={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={handleClickOpen}
      >
        Resend Verification Email
      </Typography>
      <Button disabled={isLoading} type="submit" variant="contained">
        Register
      </Button>
      <ResendEmailModal open={open} setOpen={setOpen} />
    </Stack>
  );
};

export default RegisterForm;
