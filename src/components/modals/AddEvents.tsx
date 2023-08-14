import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
  useTheme,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { Close, Close as CloseIcon } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { api } from "@/utils/api";
import type { CategoryTypes } from "@/utils/topics";
import { toast } from "react-hot-toast";

const CATEGORIES = [
  "Operations",
  "Selection",
  "Repetition",
  "Arrays",
  "Functions",
];

const statusOptions = [
  "active",
  "inactive",
  "completed",
  "cancelled",
  "upcoming",
];

const AddEvents = ({
  addModalOpen,
  setAddModalOpen,
  refetch,
}: {
  addModalOpen: boolean;
  setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => Promise<void>;
}) => {
  const theme = useTheme();
  const { mutate: createEvent, isLoading } =
    api.event.createEvent.useMutation();
  const [formData, setFormData] = React.useState<{
    name: string;
    description: string;
    start: Date;
    end: Date;
    scalar: number;
    multiplyer: "x" | "+";
    category: CategoryTypes;
  }>({
    name: "",
    description: "",
    start: new Date(),
    end: new Date(),
    scalar: 0,
    multiplyer: "x",
    category: "Arrays",
  });
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    try {
      const confirm = window.confirm(
        "Are you sure you want to create this event?"
      );
      if (!confirm) return;
      createEvent(formData, {
        onSuccess: () => {
          toast.success("Event created successfully");
          setAddModalOpen(false);
          refetch().catch(console.error);
          setFormData({
            name: "",
            description: "",
            start: new Date(),
            end: new Date(),
            scalar: 0,
            multiplyer: "x",
            category: "Arrays",
          });
        },
        onError: (error) => {
          console.error(error);
          toast.error(error.message);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
      <Stack gap={2} sx={{ padding: "1.5rem" }}>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          gap={2}
          sx={{ width: 400, bgcolor: "background.paper" }}
        >
          <Stack
            direction="row"
            sx={{ width: "100%" }}
            justifyContent={"space-between"}
          >
            <Typography
              color={theme.palette.primary.main}
              fontSize={"1.5rem"}
              fontWeight="bold"
            >
              Create an event
            </Typography>
            <IconButton onClick={() => setAddModalOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
          <TextField
            required
            label="Name"
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            value={formData.name}
          />
          <Box>
            <TextField
              required
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
              rows={2}
            />
          </Box>
          <Stack gap={2} direction="row">
            <Box position={"relative"}>
              <DatePicker
                required
                selected={formData.start}
                onChange={(date) =>
                  setFormData({ ...formData, start: date as Date })
                }
                className="custom-date-picker"
              />
              <Typography
                fontSize={"0.8rem"}
                color="gray"
                sx={{
                  position: "absolute",
                  top: -13,
                  left: 5,
                  backgroundColor: "white",
                  padding: "3px",
                }}
              >
                Start date
              </Typography>
            </Box>
            <Box position={"relative"}>
              <DatePicker
                required
                selected={formData.end}
                onChange={(date) =>
                  setFormData({ ...formData, end: date as Date })
                }
                className="custom-date-picker"
              />
              <Typography
                fontSize={"0.8rem"}
                color="gray"
                sx={{
                  position: "absolute",
                  top: -13,
                  left: 5,
                  backgroundColor: "white",
                  padding: "3px",
                }}
              >
                End date
              </Typography>
            </Box>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <TextField
              required
              value={formData.scalar}
              onChange={(e) => {
                setFormData({ ...formData, scalar: parseInt(e.target.value) });
              }}
              label="Scalar"
              type="number"
            />
            <FormControl fullWidth>
              <InputLabel>Multiplyer</InputLabel>
              <Select
                required
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    multiplyer: e.target.value as "x" | "+",
                  });
                }}
                value={formData.multiplyer}
                label="Multiplyer"
              >
                <MenuItem value={"x"}>x</MenuItem>
                <MenuItem value={"+"}>+</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              required
              onChange={(e) => {
                setFormData({
                  ...formData,
                  category: e.target.value as CategoryTypes,
                });
              }}
              value={formData.category}
              label="Category"
            >
              {CATEGORIES.map((category) => {
                return (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
            <Button disabled={isLoading} variant="contained" type="submit">
              Create
            </Button>
            <Button
              disabled={isLoading}
              variant="text"
              color="error"
              sx={{ marginRight: "1rem" }}
              onClick={() => {
                setAddModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddEvents;
