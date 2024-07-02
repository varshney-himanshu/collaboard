import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service";

const initialState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

//Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      return response;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    checkToken: (state) => {
      console.log("checking token...");
      const token = state.token;
      if (token && authService.isTokenExpired(token)) {
        authService.logout();
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      } else if (token) {
        const payload = authService.getPayloadFromToken(token);
        state.user = {
          id: payload.id,
          username: payload.username,
          role: payload.role,
        };
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, checkToken } = authSlice.actions;

export default authSlice.reducer;
