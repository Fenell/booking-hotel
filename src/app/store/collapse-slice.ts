import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Collapse = {
  isCollapse: boolean;
  subMenuId?: string | null;
};

/* subMenuId: `undefined` = người dùng chưa bấm vào nhóm nào, khi đó Sidebar tự
   mở nhóm chứa trang hiện tại; `null` = đã chủ động đóng hết. Phân biệt hai giá
   trị này để nhóm không tự bật lại sau khi người dùng đóng nó. */
const initialState: Collapse = {
  isCollapse: false,
  subMenuId: undefined,
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
