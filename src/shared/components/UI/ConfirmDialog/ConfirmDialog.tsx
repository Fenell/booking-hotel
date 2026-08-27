import { requestConfirm, type ConfirmParams } from "./confirmStore";

/**
 * Mở hộp thoại xác nhận và chờ người dùng trả lời.
 *
 * Hộp thoại do `ConfirmDialogHost` (gắn trong `AppProvider`) render, nên nó
 * nằm trong cây React chính và dùng chung vỏ với `Modal`.
 */
export const customConfirm = (params: ConfirmParams): Promise<boolean> =>
  requestConfirm(params);

export type { ConfirmParams, ConfirmOptions } from "./confirmStore";
