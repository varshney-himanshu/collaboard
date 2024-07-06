import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import boardService from "@/services/board.service";

const initialState = {
  data: [],
  loading: false,
  error: {},
};

//Thunks
export const fetchBoards = createAsyncThunk("boards/all", async (thunkAPI) => {
  try {
    const response = await boardService.getAllBoards();
    return response;
  } catch (e) {
    console.log(e);
    return thunkAPI.rejectWithValue(e.response.data);
  }
});

const boardsSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBoards.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBoards.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(fetchBoards.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// export const { logout, checkToken } = boardsSlice.actions;

export default boardsSlice.reducer;
