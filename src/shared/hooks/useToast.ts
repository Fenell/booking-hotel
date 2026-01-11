import { useToastDispatch } from "@app/store/hooks";
import { addToast, removeToast } from "@app/store/toast-slice";

export function useToast() {
  const dispatch = useToastDispatch();

  const defaultTimeOut = 2000;
  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning",
    position?: string,
    timeOut?: number
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

  function success(
    message: string,
    position = "top-right",
    timeOut = defaultTimeOut
  ) {
    showToast(message, "success", position, timeOut);
  }
  function error(
    message: string,
    position = "top-right",
    timeOut = defaultTimeOut
  ) {
    showToast(message, "error", position, timeOut);
  }
  function warning(
    message: string,
    position = "top-right",
    timeOut = defaultTimeOut
  ) {
    showToast(message, "warning", position, timeOut);
  }
  function info(
    message: string,
    position = "top-right",
    timeOut = defaultTimeOut
  ) {
    showToast(message, "info", position, timeOut);
  }

  const toast = {
    success,
    error,
    warning,
    info,
  };
  return toast;
}
