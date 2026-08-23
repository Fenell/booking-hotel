import classNames from "classnames";
import type { Header } from "@tanstack/react-table";
import { useGridContext } from "../core/gridContext";
import { SortAscIcon, SortDescIcon } from "../icons/icons";
import styles from "../styles/header.module.css";
import { overflowTooltipHandlers } from "../tooltip/overflow";
import { getPinnedEdge, getPinnedStyle } from "../utils/pinning";
import ColumnResizer from "./ColumnResizer";
import SelectionCheckbox from "../body/SelectionCheckbox";

type HeaderCellProps<T> = { header: Header<T, unknown> };

const HeaderCell = <T,>({ header }: HeaderCellProps<T>) => {
  const ctx = useGridContext<T>();
  const { column } = header;
  const colDef = ctx.colDefFor(column.id);
  const meta = column.columnDef.meta;
  const edge = getPinnedEdge(column);
  const canSort = ctx.enableSort && column.getCanSort();
  const sorted = column.getIsSorted();
  const tooltipHandlers = overflowTooltipHandlers(
    ctx.tooltip,
    colDef?.tooltip !== false,
  );

  return (
    <th
      data-col-id={column.id}
      className={classNames(styles.th, {
        [styles.thPinned]: !!edge.pinned,
        [styles.edgeLeft]: edge.isLastLeft,
        [styles.edgeRight]: edge.isFirstRight,
        [styles.sortable]: canSort,
        [styles.alignRight]: colDef?.align === "right",
        [styles.alignCenter]: colDef?.align === "center" || meta?.isSelect,
      })}
      style={{ width: header.getSize(), ...getPinnedStyle(column) }}
      aria-sort={
        sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
      }
      onClick={canSort ? column.getToggleSortingHandler() : undefined}
    >
      {meta?.isSelect ? (
        <div className={styles.thInner} style={{ justifyContent: "center" }}>
          <SelectionCheckbox
            checked={ctx.table.getIsAllPageRowsSelected()}
            indeterminate={ctx.table.getIsSomePageRowsSelected()}
            onToggle={() => ctx.table.toggleAllPageRowsSelected()}
            ariaLabel="Chọn tất cả dòng trang này"
          />
        </div>
      ) : (
        <div className={styles.thInner}>
          <span className={styles.thLabel} {...tooltipHandlers}>
            {colDef?.headerText}
          </span>
          {sorted === "asc" && <SortAscIcon className={styles.sortIcon} size={13} />}
          {sorted === "desc" && <SortDescIcon className={styles.sortIcon} size={13} />}
        </div>
      )}
      {ctx.enableResize && column.getCanResize() && <ColumnResizer header={header} />}
    </th>
  );
};

export default HeaderCell;
