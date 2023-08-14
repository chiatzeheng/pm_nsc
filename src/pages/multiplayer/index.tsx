import WaitingGlass from "@/components/WaitingGlass";
import { useGlobalContext } from "@/context";
import { Done, Info } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import Pusher from "pusher-js";
import type * as PusherTypes from "pusher-js";
import axios from "axios";
import MultiInfoModal from "@/components/modals/MultiInfoModal";

export type MultiMember = {
  id: string;
  name: string;
  email: string;
  ready: boolean;
  percentage: number;
};

export type PusherMember = {
  id: string;
  info: {
    name: string;
    email: string;
    ready: boolean;
    percentage: number;
  };
};

type Query = {
  difficulty: string;
  topics: number[];
  code?: string;
};

// function to generate random gamecode
const generateGameCode = (length: number) => {
  // const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characters = "123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const MultiPlayer = () => {
  const theme = useTheme();
  const router = useRouter();
  const { isAuth, user, resetStatistics } = useGlobalContext();
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const query = router.query as unknown as Query;
  React.useEffect(() => {
    resetStatistics();
  }, [resetStatistics]);
  const game = React.useMemo(() => {
    // console.log(query);
    const code = generateGameCode(6);
    if (!query.code) {
      return {
        code,
        channel: "presence-" + code,
        topics: query.topics,
        difficulty: query.difficulty,
      };
    } else {
      return {
        code: query.code,
        channel: "presence-" + query.code,
        topics: null,
        difficulty: null,
      };
    }
  }, [query]);
  const [members, setMembers] = React.useState<MultiMember[]>(
    [] as MultiMember[]
  );

  // pusher codes
  React.useEffect(() => {
    if (!game || !user || !isAuth) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
      authEndpoint: "api/auth/pusher",
      auth: {
        params: {
          user_id: user?._id,
        },
      },
    });
    const channel = pusher.subscribe(game.channel);
    channel.bind(
      "pusher:subscription_succeeded",
      (membersObj: { members: PusherMember }) => {
        setMembers(
          Object.entries(membersObj.members).map(([id, ifo]) => {
            const info = ifo as PusherMember["info"];
            return {
              id,
              name: info.name,
              email: info.email,
              ready: info.ready,
              percentage: info.percentage,
            };
          })
        );
      }
    );
    channel.bind("pusher:member_added", (member: PusherMember) => {
      setMembers((prev) => {
        return [
          ...prev,
          {
            id: member.id,
            name: member.info.name,
            email: member.info.email,
            percentage: member.info.percentage,
            ready: false,
          },
        ];
      });
      // console.log(game);
      if (game.difficulty && game.topics) {
        axios
          .post("/api/pusher/config", {
            channel: game.channel,
            topics: game.topics,
            difficulty: game.difficulty,
          })
          .catch(console.error);
      }
    });
    channel.bind("pusher:subscription_error", (error: PusherTypes.default) => {
      console.error(error);
    });
    channel.bind("pusher:member_removed", (member: PusherMember) => {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    });
    channel.bind("user-ready", (data: { user_id: string }) => {
      setMembers((prev) => {
        return prev.map((m) => {
          if (m.id === data.user_id) {
            return {
              ...m,
              ready: true,
            };
          }
          return m;
        });
      });
    });
    channel.bind(
      "room-config",
      (config: {
        topics: number[];
        difficulty: "beginner" | "intermediate" | "advanced";
      }) => {
        // console.log(config);
        query.difficulty = config.difficulty;
        query.topics = config.topics;
      }
    );
    return () => {
      console.log("unsubscribe");
      pusher.unsubscribe(game.channel);
    };
  }, [game, user, isAuth, query]);

  React.useEffect(() => {
    if (members.length < 2) return;
    if (members.every((m) => m.ready)) {
      router
        .push(
          {
            pathname: `/multiplayer/${game.code}`,
            query: {
              difficulty: query.difficulty,
              topics: query.topics,
            },
          },
          `/multiplayer/${game.code}`
        )
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  React.useLayoutEffect(() => {
    if (
      (!router.query.difficulty || !router.query.topics) &&
      !router.query.code
    ) {
      if (isAuth) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/authenticate";
      }
    }
  }, [router.query.difficulty, router.query.topics, isAuth, router.query.code]);

  const handleReady = React.useCallback(async () => {
    try {
      await axios.post("/api/pusher/ready", {
        channel: game.channel,
        user_id: user?._id,
      });
    } catch (error) {
      console.error(error);
    }
  }, [user, game.channel]);

  if (!user) return <CircularProgress />;
  if (!members) return;
  return (
    <Box width={"100%"}>
      <Head>
        <title>PracticeMe - PvP</title>
      </Head>
      <Stack
        alignItems={"center"}
        gap={2}
        position="absolute"
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "95%",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            position: "relative",
          }}
        >
          <Typography
            fontSize={"1.5rem"}
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            PvP
          </Typography>
          <FormControl>
            <InputLabel>Game code</InputLabel>
            <OutlinedInput
              label="Game code"
              value={game.code}
              onClick={() => {
                navigator.clipboard.writeText(game.code).catch(console.error);
                toast.success("Game code copied to clipboard!");
              }}
              readOnly
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoModalOpen(true);
                    }}
                  >
                    <Info />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Box
            sx={{
              display: members.length <= 5 ? "flex" : "grid",
              gap: 2,
              gridTemplateColumns:
                members.length > 10 ? "repeat(8, 1fr)" : "repeat(5, 1fr)",
            }}
          >
            {members.map((member) => {
              return (
                <Stack key={member.id} alignItems={"center"}>
                  <Done
                    sx={{
                      fontSize: "6rem",
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography textAlign={"center"} fontWeight="bold">
                    {member.name} {member.id === user._id && "(You)"}
                  </Typography>

                  {member.ready ? (
                    <Button
                      sx={{ marginTop: "1rem" }}
                      variant="contained"
                      disabled
                    >
                      Ready
                    </Button>
                  ) : (
                    <Button
                      sx={{
                        marginTop: "1rem",
                        cursor:
                          member.id === user._id ? "pointer" : "not-allowed",
                      }}
                      variant="contained"
                      color="primary"
                      onClick={member.id === user._id ? handleReady : undefined}
                    >
                      Not Ready
                    </Button>
                  )}
                </Stack>
              );
            })}
            {Object.entries(members).length == 1 && <WaitingGlass />}
          </Box>
        </Paper>
      </Stack>
      <MultiInfoModal
        infoModalOpen={infoModalOpen}
        setInfoModalOpen={setInfoModalOpen}
      />
    </Box>
  );
};

export default MultiPlayer;
