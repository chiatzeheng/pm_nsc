import { Button, Dialog, Stack } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import SharedOption from "./SharedOption";
import { toast } from "react-hot-toast";

type Props = {
  singlePlayerModalOpen: boolean;
  setSinglePlayerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SinglePlayerModal = (props: Props) => {
  const router = useRouter();

  const [formData, setFormData] = React.useState<{
    difficulty: "beginner" | "intermediate" | "advanced";
    topics: number[];
  }>({
    difficulty: "beginner",
    topics: [],
  });

  return (
    <Dialog
      open={props.singlePlayerModalOpen}
      onClose={() => props.setSinglePlayerModalOpen(false)}
    >
      <Stack gap={2} position="relative" padding="2rem">
        <SharedOption
          formData={formData}
          setFormData={setFormData}
          setModalOpen={props.setSinglePlayerModalOpen}
        />
        <Button
          onClick={() => {
            // reset state to default
            if (formData.topics.length === 0) {
              toast.error("Please select a topic");
              return;
            }
            props.setSinglePlayerModalOpen(false);

            router
              .push(
                {
                  pathname: "/singleplayer",
                  query: {
                    difficulty: formData.difficulty,
                    topics: formData.topics,
                  },
                },
                "/singleplayer"
              )
              .then(() => {
                setFormData({
                  difficulty: "beginner",
                  topics: [],
                });
              })
              .catch((e) => console.log(e));
          }}
          variant="contained"
          sx={{
            // position: "sticky",
            // bottom: "1rem",
            alignSelf: "flex-start",
          }}
        >
          Start
        </Button>
      </Stack>
    </Dialog>
  );
};

export default SinglePlayerModal;
