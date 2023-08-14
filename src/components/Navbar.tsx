import React from "react";

import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useGlobalContext } from "../context";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
type Props = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: Props) => {
  const router = useRouter();
  const { setMode, isAuth, user } = useGlobalContext();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <IconButton sx={{position:'relative', zIndex:999999}} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <MenuIcon />
        </IconButton>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          {theme.palette.mode === "light" ? (
            <IconButton onClick={() => setMode("dark")}>
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            </IconButton>
          ) : (
            <IconButton onClick={() => setMode("light")}>
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            </IconButton>
          )}
          <FlexBetween>
            {!isAuth ? (
              <Button variant="contained">Login</Button>
            ) : (
              <>
                <Button
                  onClick={handleClick}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textTransform: "none",
                  }}
                >
                  {!user?.avatar ? (
                    <Avatar sx={{ mr: "1rem" }} />
                  ) : (
                    <Box
                      component={"img"}
                      src={user?.avatar}
                      alt="profile"
                      height="32px"
                      width="32px"
                      borderRadius={"50%"}
                      sx={{ objectFit: "cover", mr: "1rem" }}
                    />
                  )}

                  <Box textAlign="left">
                    <Typography fontWeight={"bold"} fontSize="0.85rem">
                      {user?.name}
                    </Typography>
                  </Box>
                  <ArrowDropDownOutlined
                    sx={{
                      fontSize: "25px",
                    }}
                  />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.reload();
                      router
                        .replace("/authenticate")
                        .catch((e) => console.error(e));
                    }}
                  >
                    Log out
                  </MenuItem>
                </Menu>
              </>
            )}
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
