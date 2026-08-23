import { useImperativeHandle } from "react";
import type { Ref, RefObject } from "react";
import type { Table } from "@tanstack/react-table";
import type { ColumnDef } from "../types/column";
import type { PersistedColumnState } from "../types/persist";
import type { DataGridRef, RowNode } from "../types/ref";
import { formatCell } from "../utils/formatCell";
import { getNestedValue } from "../utils/getNestedValue";

export type GridRefInternals<T> = {
  table: Table<T>;
  colDefs: ColumnDef<T>[];
  scrollRef: RefObject<HTMLDivElement | null>;
  colDefFor: (columnId: string) => ColumnDef<T> | undefined;
  setFilter: (field: string, operator: string, value: string) => void;
  clearAllFilters: () => void;
  resetColumnStates: () => void;
  applyColumnState: (state: PersistedColumnState[]) => void;
  /** Thứ tự cột đang lưu (không gồm cột checkbox); rỗng = thứ tự khai báo */
  columnOrder: string[];
  /** Class CSS (đã hash) cho hiệu ứng flash dòng */
  flashClass: string;
};

/** Ghép toàn bộ API mệnh lệnh của DataGrid — tách khỏi DataGrid.tsx cho gọn */
export const useGridRef = <T,>(
  ref: Ref<DataGridRef<T>> | undefined,
  internals: GridRefInternals<T>,
) => {
  useImperativeHandle(ref, (): DataGridRef<T> => {
    const {
      table,
      colDefs,
      scrollRef,
      colDefFor,
      setFilter,
      clearAllFilters,
      resetColumnStates,
      applyColumnState,
      columnOrder,
      flashClass,
    } = internals;

    const getRowElement = (id: string): HTMLTableRowElement | null =>
      scrollRef.current?.querySelector<HTMLTableRowElement>(
        `tbody tr[data-row-id="${CSS.escape(id)}"]`,
      ) ?? null;

    const makeRowNode = (id: string): RowNode<T> | undefined => {
      const rows = table.getRowModel().rows;
      const row = rows.find((r) => r.id === id);
      if (!row) return undefined;
      return {
        id: row.id,
        data: row.original,
        rowIndex: rows.indexOf(row),
        isSelected: () => row.getIsSelected(),
        setSelected: (selected: boolean) => row.toggleSelected(selected),
      };
    };

    return {
      // ===== Selection =====
      getSelectedRowIds: () =>
        Object.keys(table.getState().rowSelection).filter(
          (id) => table.getState().rowSelection[id],
        ),
      getSelectedRows: () =>
        table
          .getSelectedRowModel()
          .rows.map((r) => r.original),
      setRowSelected: (id, selected) =>
        makeRowNode(id)?.setSelected(selected),
      selectAllCurrentPage: () => table.toggleAllPageRowsSelected(true),
      deselectAll: () => table.setRowSelection({}),

      // ===== Cột =====
      setColumnVisible: (field, visible) =>
        table.getColumn(field)?.toggleVisibility(visible),
      showColumns: (fields) =>
        fields.forEach((f) => table.getColumn(f)?.toggleVisibility(true)),
      hideColumns: (fields) =>
        fields.forEach((f) => table.getColumn(f)?.toggleVisibility(false)),
      pinColumn: (field, pin) => table.getColumn(field)?.pin(pin ?? false),
      setColumnWidth: (field, width) =>
        table.setColumnSizing((prev) => ({ ...prev, [field]: width })),
      getColumnState: () => {
        const order = columnOrder.length
          ? columnOrder
          : colDefs.map((c) => c.field);
        const { columnVisibility, columnSizing } = table.getState();
        return order.map<PersistedColumnState>((field) => ({
          field,
          width: columnSizing[field],
          visible: columnVisibility[field] ?? true,
        }));
      },
      applyColumnState,
      resetColumns: resetColumnStates,

      // ===== Sort / Filter / Paging =====
      // table.set* đi qua onChange handler của DataGrid → server mode tự phát onStateChange
      setSort: (field, direction) =>
        table.setSorting(
          direction ? [{ id: field, desc: direction === "desc" }] : [],
        ),
      setFilter,
      clearFilter: (field) => setFilter(field, "contains", ""),
      clearAllFilters,
      goToPage: (pageNumber) => {
        const totalPages = Math.max(1, table.getPageCount());
        const clamped = Math.min(Math.max(1, pageNumber), totalPages);
        table.setPageIndex(clamped - 1);
      },
      setPageSize: (pageSize) => table.setPageSize(pageSize),
      getPageInfo: () => {
        const { pageIndex, pageSize } = table.getState().pagination;
        return {
          pageNumber: pageIndex + 1,
          pageSize,
          totalPages: table.getPageCount(),
          rowCount: table.getRowCount(),
        };
      },

      // ===== Row =====
      getRowNode: makeRowNode,
      getDisplayedRowNodes: () =>
        table.getRowModel().rows.map((row, rowIndex) => ({
          id: row.id,
          data: row.original,
          rowIndex,
          isSelected: () => row.getIsSelected(),
          setSelected: (selected: boolean) => row.toggleSelected(selected),
        })),
      getRowElement,
      scrollToRow: (id, align = "top") => {
        getRowElement(id)?.scrollIntoView({
          block: align === "center" ? "center" : "nearest",
          behavior: "smooth",
        });
      },
      flashRow: (id) => {
        const el = getRowElement(id);
        if (!el) return;
        el.classList.remove(flashClass);
        void el.offsetWidth; // restart animation
        el.classList.add(flashClass);
        el.addEventListener(
          "animationend",
          () => el.classList.remove(flashClass),
          { once: true },
        );
      },

      // ===== Tiện ích =====
      getRows: () => table.getRowModel().rows.map((r) => r.original),
      getRow: (id) => makeRowNode(id)?.data,
      exportCsv: (opts) => {
        const visibleOnly = opts?.visibleColumnsOnly ?? true;
        const cols = (
          visibleOnly ? table.getVisibleLeafColumns() : table.getAllLeafColumns()
        ).filter((c) => !c.columnDef.meta?.isSelect);

        const header = cols.map((c) => colDefFor(c.id)?.headerText ?? c.id);
        const lines = table.getRowModel().rows.map((r) =>
          cols.map((c) => {
            const cd = colDefFor(c.id);
            if (!cd) return "";
            const raw = getNestedValue(r.original, cd.field);
            // số giữ thô để Excel còn tính được; còn lại theo hiển thị
            return typeof raw === "number" ? String(raw) : formatCell(r.original, cd);
          }),
        );

        const esc = (v: string) =>
          /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        const csv =
          "\uFEFF" +
          [header, ...lines].map((line) => line.map(esc).join(",")).join("\r\n");

        const url = URL.createObjectURL(
          new Blob([csv], { type: "text/csv;charset=utf-8" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = opts?.fileName ?? "export.csv";
        a.click();
        URL.revokeObjectURL(url);
      },
      scrollToTop: () => scrollRef.current?.scrollTo({ top: 0 }),
    };
  });
};
