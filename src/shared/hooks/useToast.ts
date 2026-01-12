import { useToastDispatch } from "@app/store/hooks";
import { addToast, removeToast } from "@app/store/toast-slice";

export function useToast() {
  const dispatch = useToastDispatch();

  const DEFAULT_TIMEOUT = 2000;
  const DEFAULT_POSITION = "top-right";

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning",
    position: string = DEFAULT_POSITION,
    timeOut: number = DEFAULT_TIMEOUT
  ) => {
    const id = Date.now().toString();
    dispatch(
      addToast({
        toast: { id, message, position, type },
      })
      // success()
    );

    setTimeout(() => {
      dispatch(removeToast({ id }));
    }, timeOut);
  };

  const toast = {
    success: (msg: string, pos?: string, t?: number) =>
      showToast(msg, "success", pos, t),
    error: (msg: string, pos?: string, t?: number) =>
      showToast(msg, "error", pos, t),
    warning: (msg: string, pos?: string, t?: number) =>
      showToast(msg, "warning", pos, t),
    info: (msg: string, pos?: string, t?: number) =>
      showToast(msg, "info", pos, t),
  };

  return toast;
}
