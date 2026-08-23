import { useEffect, useRef } from "react";
import { PERSIST_DEBOUNCE_MS } from "../core/constants";
import { savePersisted, toPersisted } from "../utils/persist";
import { useDebouncedCallback } from "./useDebouncedCallback";

/**
 * Tự lưu cấu hình cột vào localStorage "grid:<gridKey>" (debounce 500ms),
 * flush ngay khi unmount nếu còn thay đổi đang chờ (đổi cột rồi rời trang
 * trong <500ms vẫn không mất). Không có gridKey → no-op.
 * Việc LOAD nằm ở DataGrid (lazy init state).
 */
export const useGridPersistence = (
  gridKey: string | undefined,
  current: {
    columnOrder: string[];
    columnVisibility: Record<string, boolean>;
    columnSizing: Record<string, number>;
  },
) => {
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  });

  const pendingRef = useRef(false);

  const save = useDebouncedCallback(() => {
    pendingRef.current = false;
    if (!gridKey) return;
    const c = currentRef.current;
    savePersisted(
      gridKey,
      toPersisted(c.columnOrder, c.columnVisibility, c.columnSizing),
    );
  }, PERSIST_DEBOUNCE_MS);

  const isFirst = useRef(true);
  useEffect(() => {
    // Bỏ qua lần mount (giá trị vừa load, chưa có gì mới để lưu)
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    pendingRef.current = true;
    save();
  }, [current.columnOrder, current.columnVisibility, current.columnSizing, save]);

  // Flush khi unmount: còn thay đổi chưa lưu thì ghi thẳng, không chờ debounce
  useEffect(
    () => () => {
      if (pendingRef.current && gridKey) {
        const c = currentRef.current;
        savePersisted(
          gridKey,
          toPersisted(c.columnOrder, c.columnVisibility, c.columnSizing),
        );
      }
    },
    [gridKey],
  );
};
