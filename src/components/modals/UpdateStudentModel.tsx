import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CLASSES from "@/utils/classes";
import { useGlobalContext } from "@/context";

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

export default function UpdateStudentModel({
  id,
  email,
  name,
  course,
  className,
  open,
  onClose,
  refetch,
}: {
  id: string;
  email: string;
  name: string;
  course: string;
  className: string;
  open: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}) {
  const { mutate: updateDB } = api.data.updateUser.useMutation();
  const { mutate: resetScore } = api.data.resetUserScore.useMutation();

  const { user } = useGlobalContext();

  // React.useEffect(() => {
  //   if (!user) return;
  //   if (!isAuth) {
  //     router.replace("/authenticate").catch(console.error);
  //     return;
  //   }
  //   if (user.role !== "admin") {
  //     router.replace("/dashboard").catch(console.error);
  //     return;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, isAuth]);

  const [txtEmail, setEmail] = React.useState<string>(email);
  const [txtName, setName] = React.useState<string>("");
  const [txtCourse, setCourse] = React.useState<string>("");
  const [txtClassName, setClassName] = React.useState<string>("");

  React.useEffect(() => {
    setEmail(email);
    setName(name);
    setCourse(course);
    setClassName(className);
  }, [email, name, course, className]);

  const onUpdateHandler = () => {
    if (!id) {
      toast.error("No ID!!!");
      return;
    }
    if (
      txtEmail === "" ||
      txtName === "" ||
      txtCourse === "" ||
      txtClassName === ""
    ) {
      toast.error("Please fill in all the fields");
      return;
    }
    updateDB(
      {
        id: id,
        data: {
          email: txtEmail,
          name: txtName,
          course: txtCourse,
          class: txtClassName,
        },
      },
      {
        onSuccess: (data) => {
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

  const onResetScoreHandler = () => {
    if (!id) {
      toast.error("No ID!!!");
      return;
    }

    if (user !== undefined && user.role !== "superadmin") {
      toast.error("You do not have access to this feature.");
      return;
    }

    resetScore(
      {
        id: id,
      },
      {
        onSuccess: (data) => {
          toast.success("Score reset successful!", {
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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{}}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            fontWeight={600}
            marginBottom={1}
          >
            Update Student
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
            label="Email"
            focused={email === txtEmail ? false : true}
            color={email === txtEmail ? undefined : "info"}
            value={txtEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            label="Name"
            focused={name === txtName ? false : true}
            color={name === txtName ? undefined : "info"}
            value={txtName}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <FormControl required>
            <InputLabel>Course</InputLabel>
            <Select
              required
              color={course === txtCourse ? undefined : "info"}
              value={txtCourse}
              label="Course"
              onChange={(e) => {
                setCourse(e.target.value);
              }}
            >
              <MenuItem value={"DIT"}>DIT</MenuItem>
              <MenuItem value={"DISM"}>DISM</MenuItem>
              <MenuItem value={"DAAA"}>DAAA</MenuItem>
              <MenuItem value={"DCITP"}>DCITP</MenuItem>
            </Select>
          </FormControl>
          <FormControl required>
            <InputLabel>Class</InputLabel>
            <Select
              required
              color={className === txtClassName ? undefined : "info"}
              value={txtClassName}
              label="Class"
              onChange={(e) => {
                setClassName(e.target.value);
              }}
            >
              {txtCourse === "" ? (
                <MenuItem value={""} disabled>
                  Select a course first
                </MenuItem>
              ) : (
                CLASSES[txtCourse as "DIT" | "DISM" | "DAAA" | "DCITP"].map(
                  (c) => {
                    return (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    );
                  }
                )
              )}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {user && user.role === "superadmin" ? (
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to reset the score of this student?"
                );
                if (confirm) onResetScoreHandler();
              }}
              sx={{ marginRight: "1rem" }}
            >
              Reset Score
            </Button>
          ) : (
            <div />
          )}

          <Box>
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
                  "Are you sure you want to update this student?"
                );
                if (confirm) onUpdateHandler();
              }}
            >
              Update
            </Button>
          </Box>
        </Box>
        {/* <Typography id="modal-modal-title" variant="h6" component="h2">
          {id + " " + email + " " + name + " " + course + " " + className}
        </Typography> */}
      </Box>
    </Modal>
  );
}
