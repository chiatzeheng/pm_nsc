import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Modal,
  Box,
  Button,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
const EditEvents = ({
  id,
  name,
  desc,
  startdate,
  enddate,
  multiplierValue,
  multiplierType,
  status,
  actions,
  open,
  refetch,
  onClose,
}: {
  id: string;
  name: string;
  desc: string;
  startdate: Date;
  enddate: Date;
  multiplierValue: number;
  multiplierType: string;
  status: string;
  actions: string;
  open: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}) => {
  const { mutate: updateDB } = api.event.updateEvent.useMutation();

  const [txtName, setName] = React.useState<string>("");
  const [txtDesc, setDesc] = React.useState<string>("");
  const [txtStartDate, setStartDate] = React.useState<Date>(new Date());
  const [txtEndDate, setEndDate] = React.useState<Date>(new Date());
  const [txtMultiplierType, setMultiplierType] = React.useState<string>("");
  const [txtMultiplierValue, setMultiplierValue] = React.useState<number>(0);
  const [txtStatus, setStatus] = React.useState<string>("");
  const [txtActions, setActions] = React.useState<string>("");

  React.useEffect(() => {
    setName(name);
    setDesc(desc);
    setStartDate(startdate);
    setEndDate(enddate);
    setMultiplierType(multiplierType);
    setMultiplierValue(multiplierValue);
    setStatus(status);
    setActions(actions);
  }, [
    name,
    desc,
    startdate,
    enddate,
    multiplierType,
    multiplierValue,
    status,
    actions,
  ]);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 600,
    width: "95%",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const onUpdateHandler = () => {
    if (
      txtName === "" ||
      txtDesc === "" ||
      txtMultiplierType === "" ||
      txtMultiplierValue === 0 ||
      txtStatus === "" ||
      txtActions === ""
    ) {
      toast.error("Please fill in all the fields");
      return;
    }

    updateDB(
      {
        id: id,
        data: {
          eventname: txtName,
          desc: txtDesc,
          startdate: txtStartDate.toDateString(),
          enddate: txtEndDate.toDateString(),
          multiplierType: txtMultiplierType,
          multiplierValue: txtMultiplierValue,
          status: txtStatus,
        },
      },
      {
        onSuccess: () => {
          toast.success("Update successful", {
            icon: "🎉",
            duration: 6000,
          });
          void refetch();
        },
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{}}>
          <Typography
            id="modal-modal-title"
            fontSize={"1.5rem"}
            fontWeight={600}
            marginBottom={1}
          >
            Update Event
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h5"
            fontWeight={400}
            color="gray"
            marginBottom={3}
          >
            ID : {id}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            // gridTemplateRows: "repeat(3, 1fr)",
            // gridAutoRows="180px"
            gap: "10px",
            marginBottom: "2rem",
          }}
        >
          <TextField
            label="Name"
            focused={name === txtName ? false : true}
            color={name === txtName ? undefined : "info"}
            value={txtName}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <TextField
            label="Description"
            focused={desc === txtDesc ? false : true}
            color={desc === txtDesc ? undefined : "info"}
            value={txtDesc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />

          <Stack gap={2} direction="row" sx={{ mt: 1, width: "100%" }}>
            <Box position={"relative"} width="100%">
              <DatePicker
                required
                selected={txtStartDate}
                onChange={(date) => setStartDate(date as Date)}
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
            <Box position={"relative"} width="100%">
              <DatePicker
                required
                selected={txtEndDate}
                onChange={(date) => setEndDate(date as Date)}
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

          <Stack direction="row" gap={2}>
            <TextField
              fullWidth
              label="Multiplier Value"
              type="number"
              value={txtMultiplierValue}
              onChange={(e) => {
                setMultiplierValue(Number(e.target.value));
              }}
            />

            <FormControl required fullWidth>
              <InputLabel>Multiplier Type</InputLabel>
              <Select
                required
                value={txtMultiplierType}
                label="Multiplyer"
                onChange={(e) => {
                  setMultiplierType(e.target.value);
                }}
              >
                <MenuItem value={"+"}>+</MenuItem>
                <MenuItem value={"x"}>x</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="text"
            color="error"
            onClick={onClose}
            sx={{ marginRight: "1rem" }}
          >
            Cancel
          </Button>
          <Button
            variant="text"
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure you want to update this event?"
              );
              if (confirm) onUpdateHandler();
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditEvents;
