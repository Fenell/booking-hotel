import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Collapse = {
  isCollapse: boolean;
  subMenuId?: string | null;
};

const initialState: Collapse = {
  isCollapse: true,
  subMenuId: null,
};

export const collapseSlice = createSlice({
  name: "collapse",
  initialState: initialState,
  reducers: {
    toogleCollapse(state) {
      state.isCollapse = !state.isCollapse;
      if (state.isCollapse) {
        state.subMenuId = null;
      }
    },

    toogleCollapseSubMenu(state, action: PayloadAction<{ menuId: string }>) {
      if (state.subMenuId === action.payload.menuId) {
        state.subMenuId = null;
      } else {
        state.subMenuId = action.payload.menuId;
      }

      if (state.subMenuId) {
        state.isCollapse = false;
      }
    },
  },
});

export const { toogleCollapse, toogleCollapseSubMenu } = collapseSlice.actions;
