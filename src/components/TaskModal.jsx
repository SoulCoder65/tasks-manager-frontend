import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { IconButton, TextField } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function TaskModal({
  open,
  handleClose,
  onSubmit,
  isEditing,
  task = {},
  titleStyle = {},
  actionsStyle = {},
  contentStyle = {},
}) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState("todo");
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (task && isEditing) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
    }
  }, [task, isEditing]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        title,
        description,
        status,
      });
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <DialogTitle
          style={titleStyle}
          display={"flex"}
          justifyContent={"space-between"}
          data-testid="modal-dialog-title"
        >
          {task?._id ? "Edit Task" : "Add Task"}
          <IconButton
            data-testid="modal-dialog-close-btn"
            onClick={handleClose}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Box position="relative">
          <DialogContent style={contentStyle}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
            <TextField
              label="Status"
              variant="outlined"
              fullWidth
              margin="normal"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              select={isEditing}
              SelectProps={{
                native: true,
              }}
              disabled={!isEditing}
            >
              <option value="todo">TODO</option>
              <option value="in-progress">IN PROGRESS</option>
              <option value="done">DONE</option>
            </TextField>
          </DialogContent>
          <DialogActions
            data-testid="modal-dialog-actions"
            style={actionsStyle}
          >
            <Button
              data-testid="modal-dialog-cancel-btn"
              variant="outlined"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              data-testid="modal-dialog-confirm-btn"
              variant="contained"
              onClick={handleSubmit}
              autoFocus
            >
              {task?._id ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Modal>
  );
}
