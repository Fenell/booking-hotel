import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import ConfirmDialogHost from "@shared/components/UI/ConfirmDialog/ConfirmDialogHost";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Điểm hiển thị chung cho customConfirm, đặt trong cây React chính */}
        <ConfirmDialogHost />
      </QueryClientProvider>
    </Provider>
  );
};
