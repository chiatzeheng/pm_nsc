import React from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  PersonOutline,
  Groups2Outlined,
  PointOfSaleOutlined,
  TodayOutlined,
  TransitEnterexit,
  Source,
  School,
  Feedback,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useGlobalContext } from "@/context";
import SinglePlayerModal from "./modals/SinglePlayerModal";
import MultiPlayerModal from "./modals/MultiPlayerModal";
import JoinGameModal from "./modals/JoinGameModal";
import Image from "next/image";
import seedImage from "../assets/seed.jpg";
import FeedbackModal from "./modals/FeedbackModal";
import FeedbackIcon from "@mui/icons-material/Feedback";

type Props = {
  isNonMobile: boolean;
  drawerWidth: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const theme = useTheme();
  // pathname is something like '/dashboard'
  const { pathname } = router;
  const [active, setActive] = React.useState("");
  const [singlePlayerModalOpen, setSinglePlayerModalOpen] =
    React.useState(false);
  const [multiPlayerModalOpen, setMultiPlayerModalOpen] = React.useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);
  const [joinGameModalOpen, setJoinGameModalOpen] = React.useState(false);
  React.useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const navItems = React.useMemo(() => {
    if (!user) return [];
    const res = [
      {
        text: "Dashboard",
        icon: <HomeOutlined />,
      },
      {
        text: "Play",
        icon: null,
      },
      {
        text: "Join Game",
        icon: <TransitEnterexit />,
        onClick: () => {
          if (!isNonMobile) {
            setIsSidebarOpen(false);
          }
          setJoinGameModalOpen(true);
        },
      },
      {
        text: "Multi Player",
        icon: <Groups2Outlined />,
        onClick: () => {
          setMultiPlayerModalOpen(true);
          if (!isNonMobile) {
            setIsSidebarOpen(false);
          }
        },
      },
      {
        text: "Single Player",
        icon: <PersonOutline />,
        onClick: () => {
          setSinglePlayerModalOpen(true);
        },
      },

      {
        text: "Others",
        icon: null,
      },

      {
        text: "Feedback",
        icon: <Feedback />,
        onClick: () => {
          setFeedbackModalOpen(true);
        },
      },
    ];
    if (user.role === "admin" || user.role === "superadmin") {
      res.push({
        text: "Admin Dashboard",
        icon: null,
      });
      res.push({
        text: "Admin",
        icon: <PointOfSaleOutlined />,
      });
      res.push({
        text: "Content Studio",
        icon: <Source />,
        onClick: () => {
          window.open("https://practiceme.sanity.studio", "_blank");
        },
      });
    }
    return res;
  }, [user, isNonMobile, setIsSidebarOpen]);

  return (
    <>
      <Box component={"nav"}>
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: theme.palette.primary.main,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
            },
          }}
        >
          <Box width={"100%"}>
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.primary.contrastText}>
                <Box
                  display={"flex"}
                  alignItems="center"
                  gap="0.5rem"
                  justifyContent={"center"}
                  width={"100%"}
                >
                  <Image
                    src={seedImage}
                    alt="Picture of the author"
                    width={40}
                    height={40}
                  />

                  <Link
                    color={theme.palette.primary.contrastText}
                    sx={{ marginRight: "2rem", textDecoration: "none" }}
                    href="/dashboard"
                    variant="h4"
                    fontWeight={"bold"}
                  >
                    PracticeMe
                  </Link>

                  {!isNonMobile && (
                    <IconButton
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                      <ChevronLeft color="info" />
                    </IconButton>
                  )}
                </Box>
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, onClick, pill_count }) => {
                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      sx={{ m: "1rem 0 1rem 3rem" }}
                      fontWeight="bold"
                      color={theme.palette.primary.contrastText}
                      fontSize="1rem"
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();
                let should_show_pill = false;
                if (pill_count !== undefined) {
                  if (pill_count > 0) {
                    should_show_pill = true;
                  }
                }
                if (active === lcText) {
                  should_show_pill = false;
                }

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={
                        onClick
                          ? onClick
                          : () => {
                              if (!isNonMobile) {
                                setIsSidebarOpen(false);
                              }
                              router.push(`/${lcText}`).catch((err) => {
                                console.error(err);
                              });
                              setActive(lcText);
                            }
                      }
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.primary.dark
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color: theme.palette.primary.contrastText,
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                      {should_show_pill && (
                        <Badge
                          badgeContent={pill_count}
                          color="secondary"
                          sx={{ mr: "1rem" }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box sx={{ mt: "auto" }}>
            <Divider />
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              direction="row"
              gap={2}
              textTransform={"none"}
              m="1.5rem 2rem"
            >
              {user?.avatar ? (
                <Box
                  component={"img"}
                  src={user.avatar}
                  alt="profile"
                  height="40px"
                  width="40px"
                  borderRadius={"50%"}
                  sx={{ objectFit: "cover" }}
                />
              ) : (
                <Avatar />
              )}
              <Box textAlign="left">
                <Typography
                  fontWeight={"bold"}
                  whiteSpace="nowrap"
                  fontSize="0.9rem"
                  color={theme.palette.primary.contrastText}
                >
                  {user?.name}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Drawer>
      </Box>
      <SinglePlayerModal
        singlePlayerModalOpen={singlePlayerModalOpen}
        setSinglePlayerModalOpen={setSinglePlayerModalOpen}
      />
      <MultiPlayerModal
        multiPlayerModalOpen={multiPlayerModalOpen}
        setMultiPlayerModalOpen={setMultiPlayerModalOpen}
      />
      <JoinGameModal
        joinGameModalOpen={joinGameModalOpen}
        setJoinGameModalOpen={setJoinGameModalOpen}
      />
      <FeedbackModal
        feedbackModalOpen={feedbackModalOpen}
        setFeedbackModalOpen={setFeedbackModalOpen}
      />
    </>
  );
};

export default Sidebar;
