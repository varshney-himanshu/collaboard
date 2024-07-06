import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import boardsSlice from "./boards.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsSlice,
  },
});

export default store;
