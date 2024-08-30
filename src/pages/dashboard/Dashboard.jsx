import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  fetchTasks,
  updateTaskStatus,
  deleteTask,
  addTask,
  updateTask,
} from "../../store/slices/tasksListSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MuiSelect as Select } from "../../components/Select";
import TaskModal from "../../components/TaskModal";
import { format } from "date-fns";
import debounce from "lodash/debounce";

import NoDataIcon from "@mui/icons-material/Inbox";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const taskStatus = useSelector((state) => state.tasks.status);
  const [open, setOpen] = React.useState(false);
  const [sortValue, setSortValue] = React.useState("asc");
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const error = useSelector((state) => state.tasks.error);
  const isLoading = useSelector((state) => state.tasks.isLoading);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);

  
  const handleOpen = () => {
    setSelectedTask(null);
    setIsEditing(false);
    setOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsEditing(true);
    setOpen(true);
  };

  const handleOpenViewDetails = (task) => {
    setSelectedTaskForDetails(task);
    setViewDetailsOpen(true);
  };
  
  const handleCloseViewDetails = () => {
    setViewDetailsOpen(false);
    setSelectedTaskForDetails(null);
  };
  
  const handleClose = () => setOpen(false);

  const handleOpenConfirmDialog = (task) => {
    setSelectedTask(task);
    setConfirmDialogOpen(true);
  };
  const handleCloseConfirmDialog = () => {
    setSelectedTask(null);
    setConfirmDialogOpen(false);
  };
  const handleConfirmDelete = () => {
    if (selectedTask) {
      dispatch(deleteTask({ id: selectedTask._id }));
    }
    handleCloseConfirmDialog();
  };

  const handleSubmit = (taskData) => {
    if (isEditing) {
      dispatch(updateTask({ ...taskData, id: selectedTask._id }));
    } else {
      dispatch(addTask(taskData));
    }
    handleClose();
  };

  const options = [
    { value: "desc", label: "Latest" },
    { value: "asc", label: "Oldest" },
  ];

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortValue(value);
    dispatch(fetchTasks({ search: searchValue, sort: value }));
  };
  const handleSearchChange = useCallback(
    debounce((value) => {
      dispatch(fetchTasks({ search: value, sort: sortValue }));
    }, 300),
    [dispatch, sortValue]
  );

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (taskStatus === "idle") {
      dispatch(fetchTasks({ search: searchValue, sort: sortValue }));
    }
  }, [taskStatus, dispatch, searchValue, sortValue]);

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    handleSearchChange(value);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus =
      destination.droppableId === "todo"
        ? "todo"
        : destination.droppableId === "in-progress"
        ? "in-progress"
        : "done";

    dispatch(updateTaskStatus({ id: draggableId, status: newStatus }));
  };

  const renderTaskCard = (task, provided) => (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={{
        mb: 2,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        p: 2,
        position: "relative",
      }}
    >
      <CardContent
        sx={{ display: "flex", flexDirection: "column", height: "150px" }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {task.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {task.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Created {format(new Date(task.createdAt), "MMMM dd, yyyy, hh:mm a")}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            display: "flex",
            gap: "8px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
            onClick={() => handleOpenViewDetails(task)}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
            onClick={() => handleOpenConfirmDialog(task)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
            onClick={() => handleOpenEdit(task)}
          >
            Update
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderNoData = (message) => (
    <Box textAlign="center" p={4} color="text.secondary">
      <NoDataIcon sx={{ fontSize: 48 }} />
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        padding: { xs: "10px", sm: "20px" },
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mb: 2,
            width: { xs: "100%", sm: "auto" },
            display: "block",
            bgcolor: "#1976d2",
            color: "white",
          }}
          onClick={handleOpen}
        >
          Add Task
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "4px",
          bgcolor: "background.paper",
        }}
      >
        <Box display={"flex"}>
          <Box mt={1} mr={1}>
            Search:{" "}
          </Box>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchValue}
            onChange={handleSearchInputChange}
          />
        </Box>
        <Box display={"flex"}>
          <Box mt={1} mr={1}>
            Sort By:{" "}
          </Box>
          <Select
            name={""}
            handleChange={handleSortChange}
            options={options}
            value={sortValue}
          />
        </Box>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
                borderRadius: "4px",
                mb: 2,
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                sx={{ bgcolor: "#1976d2", color: "white", p: 1 }}
              >
                TODO
              </Typography>
              <Droppable droppableId="todo">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ minHeight: "200px" }}
                  >
                    {todoTasks.length > 0
                      ? todoTasks.map((task, index) => (
                          <Draggable
                            key={task._id.toString()}
                            draggableId={task._id.toString()}
                            index={index}
                          >
                            {(provided) => renderTaskCard(task, provided)}
                          </Draggable>
                        ))
                      : renderNoData("No tasks in todo")}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                mb: 2,
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                sx={{ bgcolor: "#1976d2", color: "white", p: 1 }}
              >
                IN PROGRESS
              </Typography>
              <Droppable droppableId="in-progress">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ minHeight: "200px" }}
                  >
                    {inProgressTasks.length > 0
                      ? inProgressTasks.map((task, index) => (
                          <Draggable
                            key={task._id.toString()}
                            draggableId={task._id.toString()}
                            index={index}
                          >
                            {(provided) => renderTaskCard(task, provided)}
                          </Draggable>
                        ))
                      : renderNoData("No tasks in in-progress")}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                mb: 2,
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                sx={{ bgcolor: "#1976d2", color: "white", p: 1 }}
              >
                DONE
              </Typography>
              <Droppable droppableId="done">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ minHeight: "200px" }}
                  >
                    {doneTasks.length > 0
                      ? doneTasks.map((task, index) => (
                          <Draggable
                            key={task._id.toString()}
                            draggableId={task._id.toString()}
                            index={index}
                          >
                            {(provided) => renderTaskCard(task, provided)}
                          </Draggable>
                        ))
                      : renderNoData("No tasks in done")}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Grid>
        </Grid>
      </DragDropContext>

      <TaskModal
        open={open}
        handleClose={handleClose}
        onSubmit={handleSubmit}
        task={selectedTask}
        isEditing={isEditing}
      />
       <Dialog
        open={viewDetailsOpen}
        onClose={handleCloseViewDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTaskForDetails && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTaskForDetails.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedTaskForDetails.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created {format(new Date(selectedTaskForDetails.createdAt), "MMMM dd, yyyy, hh:mm a")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the task "{selectedTask?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
