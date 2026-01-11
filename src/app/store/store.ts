import { configureStore } from "@reduxjs/toolkit";
import { collapseSlice } from "./collapse-slice";
import { toastSlice } from "./toast-slice";

export const store = configureStore({
  reducer: {
    collapse: collapseSlice.reducer,
    toast: toastSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
