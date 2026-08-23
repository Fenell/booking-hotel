import { useEffect, useMemo, useRef } from "react";

export type DebouncedFn<A extends unknown[]> = {
  (...args: A): void;
  /** Hủy lần gọi đang chờ (nếu có) */
  cancel: () => void;
};

/** Debounce một callback; tự clear timeout khi unmount (tránh setState sau unmount) */
export const useDebouncedCallback = <A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number,
): DebouncedFn<A> => {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  const timer = useRef<number | undefined>(undefined);

  const debounced = useMemo<DebouncedFn<A>>(() => {
    const run = (...args: A) => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => fnRef.current(...args), ms);
    };
    run.cancel = () => window.clearTimeout(timer.current);
    return run;
  }, [ms]);

  useEffect(() => () => debounced.cancel(), [debounced]);

  return debounced;
};
