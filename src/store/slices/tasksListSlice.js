import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/constants";

// Async thunks
export const addTask = createAsyncThunk("tasks/addTask", async (task, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/tasks`, task, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong!");
  }
});

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ search = "", sort = "asc" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/tasks?search=${encodeURIComponent(search)}&sort=${sort}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("RESPONSE--",response.data.tasks)
      console.log("TOKEN0=",token)
      return response.data.tasks;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Something went wrong!");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE_URL}/tasks/${task.id}`, task, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Something went wrong!");
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/tasks/${id}`,
        { status },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Something went wrong!");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Something went wrong!");
    }
  }
);

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        // state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isLoading = false;
      });

    builder
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks.push(action.payload.task);
        state.isLoading = false;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isLoading = false;
      });

    builder
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const taskIndex = state.tasks.findIndex(
          (task) => task._id === action.payload.task._id
        );
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload.task;
        }
        state.isLoading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isLoading = false;
      });

      builder
      .addCase(updateTaskStatus.pending, (state, action) => {
        state.status = "loading";
        // state.isLoading = true;
        state.previousState = [...state.tasks];
        const taskIndex = state.tasks.findIndex(task => task._id === action.meta.arg.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = {
            ...state.tasks[taskIndex],
            status: action.meta.arg.status
          };
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        
        const taskIndex = state.tasks.findIndex(
          (task) => task._id === action.payload.task._id
        );
    
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload.task;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload;
    
        if (state.previousState) {
          state.tasks = [...state.previousState];
          delete state.previousState;
        }
      });
    

    builder
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default taskSlice.reducer;
