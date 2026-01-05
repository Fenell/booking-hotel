import { configureStore } from "@reduxjs/toolkit";
import { collapseSlice } from "./collapse-slice";

export const store = configureStore({
  reducer: {
    collapse: collapseSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
