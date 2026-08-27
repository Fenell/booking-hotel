/**
 * Hàng đợi yêu cầu xác nhận, nằm ngoài React để `customConfirm` gọi được từ
 * bất cứ đâu (kể cả hàm không phải component). `ConfirmDialogHost` đọc hàng đợi
 * này qua useSyncExternalStore và render hộp thoại của yêu cầu đầu tiên.
 */
export type ConfirmOptions = {
  falseButtonText?: string;
  trueButtonText?: string;
};

export type ConfirmParams = {
  title?: string;
  text: string;
  options?: ConfirmOptions;
  /** Hành động phá huỷ (xoá...) — nút đồng ý chuyển sang màu cảnh báo */
  danger?: boolean;
};

export type ConfirmRequest = ConfirmParams & { id: string };

type PendingRequest = ConfirmRequest & { resolve: (answer: boolean) => void };

let queue: PendingRequest[] = [];
// Ảnh chụp hiện tại — giữ nguyên tham chiếu khi hàng đợi không đổi đầu,
// useSyncExternalStore so sánh bằng Object.is nên đây là điều kiện bắt buộc
let snapshot: ConfirmRequest | null = null;
let nextId = 0;

const listeners = new Set<() => void>();

const syncSnapshot = () => {
  const next = queue[0] ?? null;
  if (next === snapshot) return;

  snapshot = next;
  listeners.forEach((listener) => listener());
};

export const subscribeConfirm = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getConfirmSnapshot = () => snapshot;

export const requestConfirm = (params: ConfirmParams) =>
  new Promise<boolean>((resolve) => {
    nextId += 1;
    queue.push({ ...params, id: `confirm-${nextId}`, resolve });
    syncSnapshot();
  });

export const answerConfirm = (id: string, answer: boolean) => {
  const request = queue.find((item) => item.id === id);
  if (!request) return;

  queue = queue.filter((item) => item.id !== id);
  syncSnapshot();
  request.resolve(answer);
};

/** Chỉ dùng cho test: dọn hàng đợi giữa các ca kiểm thử */
export const resetConfirmQueue = () => {
  queue = [];
  snapshot = null;
};
