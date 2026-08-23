import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// globals: false nên RTL không tự dọn — phải gỡ DOM sau mỗi test
afterEach(() => {
  cleanup();
});

// jsdom chưa có ResizeObserver, mà DataGrid dùng nó để đo bề rộng thanh cuộn
if (!("ResizeObserver" in globalThis)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;
}
