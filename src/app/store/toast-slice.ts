import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Toast = {
  id: string;
  message: string;
  position?: string;
  type: "success" | "error" | "info" | "warning";
};

type ToastState = {
  listToast: Toast[];
};

const initialState: ToastState = {
  listToast: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState: initialState,
  reducers: {
    addToast(state, action: PayloadAction<{ toast: Toast }>) {
      state.listToast.push(action.payload.toast);
      // state.position = action.payload.position;
      // state.message = action.payload.message;
    },
    removeToast(state, action: PayloadAction<{ id: string }>) {
      state.listToast = state.listToast.filter(
        (toast) => toast.id !== action.payload.id
      );
    },
  },
});

// export const toastReducer = toastSlice.reducer;
export const { addToast, removeToast } = toastSlice.actions;
