import type { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "../icons/icons";
import styles from "../styles/pager.module.css";

type PagerProps<T> = {
  table: Table<T>;
  pageSizeOptions: number[];
};

/** Thanh phân trang dưới cùng — kiểu AG Grid: cỡ trang · "x đến y trong z" · nút chuyển */
const Pager = <T,>({ table, pageSizeOptions }: PagerProps<T>) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getRowCount();
  const pageCount = table.getPageCount();
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className={styles.pager}>
      <div className={styles.sizeBox}>
        <span>Cỡ trang:</span>
        <select
          className={styles.sizeSelect}
          value={pageSize}
          aria-label="Số dòng mỗi trang"
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <span className={styles.rangeText}>
        {from.toLocaleString("vi-VN")} đến {to.toLocaleString("vi-VN")} trong{" "}
        {total.toLocaleString("vi-VN")}
      </span>

      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Trang đầu"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
        >
          <ChevronsLeftIcon />
        </button>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Trang trước"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <ChevronLeftIcon />
        </button>
        <span className={styles.pageText}>
          Trang {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Trang sau"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ChevronRightIcon />
        </button>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Trang cuối"
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(Math.max(0, pageCount - 1))}
        >
          <ChevronsRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Pager;
