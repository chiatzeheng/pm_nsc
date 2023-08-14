import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import Tables from "@/components/Tables";
import AddEvents from "@/components/modals/AddEvents";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

const EventsCol = () => {
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const { data: data, refetch } = api.event.getEvents.useQuery();
  const { mutate: deleteAllEvents } = api.event.deleteAllEvents.useMutation();

  const refreshPage = async () => {
    try {
      await refetch();
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(err);
      toast.error(message, {
        icon: "🤔",
        duration: 6000,
      });
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: 4,
          py: 2,
        }}
      >
        <Stack direction="row" sx={{ mb: 4, gap: 2 }}>
          <Button variant="outlined" onClick={() => setAddModalOpen(true)}>
            Create new event
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure you want to delete all events?"
              );
              if (!confirm) return;
              deleteAllEvents(undefined, {
                onSuccess: () => {
                  toast.success("All events deleted successfully");
                  refetch().catch(console.error);
                },
              });
            }}
          >
            Delete all events
          </Button>
        </Stack>
        <Tables data={data || []} refetch={refreshPage} />

        <AddEvents
          addModalOpen={addModalOpen}
          setAddModalOpen={setAddModalOpen}
          refetch={refreshPage}
        />
      </Box>
    </div>
  );
};

export default EventsCol;
