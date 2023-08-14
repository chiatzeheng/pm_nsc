import React from "react";
import { Button, Dialog, Stack } from "@mui/material";
import { useRouter } from "next/router";
import SharedOption from "./SharedOption";
import { toast } from "react-hot-toast";
type Props = {
  multiPlayerModalOpen: boolean;
  setMultiPlayerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MultiPlayerModal = ({
  multiPlayerModalOpen,
  setMultiPlayerModalOpen,
}: Props) => {
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
      open={multiPlayerModalOpen}
      onClose={() => setMultiPlayerModalOpen(false)}
    >
      <Stack gap={2} position="relative" padding="2rem">
        <SharedOption
          formData={formData}
          setFormData={setFormData}
          setModalOpen={setMultiPlayerModalOpen}
        />
        <Button
          onClick={() => {
            if (formData.topics.length === 0) {
              toast.error("Please select at least one topic");
              return;
            }
            setMultiPlayerModalOpen(false);
            // reset state to default

            router
              .push(
                {
                  pathname: "/multiplayer",
                  query: {
                    difficulty: formData.difficulty,
                    topics: formData.topics,
                  },
                }
                // "/multiplayer"
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
          Create room
        </Button>
      </Stack>
    </Dialog>
  );
};

export default MultiPlayerModal;
