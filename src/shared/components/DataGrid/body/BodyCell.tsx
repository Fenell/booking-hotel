import classNames from "classnames";
import type { Cell } from "@tanstack/react-table";
import { useGridContext } from "../core/gridContext";
import styles from "../styles/body.module.css";
import { formatCell } from "../utils/formatCell";
import { getPinnedEdge, getPinnedStyle } from "../utils/pinning";
import SelectionCheckbox from "./SelectionCheckbox";

type BodyCellProps<T> = {
  cell: Cell<T, unknown>;
  rowIndex: number;
  colIndex: number;
};

/**
 * Ô body DUY NHẤT của grid — mọi <td> đều đi qua đây.
 * data-row-id / data-col-id + rowIndex/colIndex là địa chỉ cell
 * cho keyboard navigation & batch edit (v2).
 */
const BodyCell = <T,>({ cell, rowIndex, colIndex }: BodyCellProps<T>) => {
  const ctx = useGridContext<T>();
  const { column, row } = cell;
  const colDef = ctx.colDefFor(column.id);
  const meta = column.columnDef.meta;
  const edge = getPinnedEdge(column);

  return (
    <td
      data-row-id={row.id}
      data-col-id={column.id}
      data-row-index={rowIndex}
      data-col-index={colIndex}
      className={classNames(styles.td, {
        [styles.tdPinned]: !!edge.pinned,
        [styles.edgeLeft]: edge.isLastLeft,
        [styles.edgeRight]: edge.isFirstRight,
        [styles.alignRight]: colDef?.align === "right",
        [styles.alignCenter]: colDef?.align === "center" || meta?.isSelect,
      })}
      style={{ width: column.getSize(), ...getPinnedStyle(column) }}
    >
      {meta?.isSelect ? (
        <SelectionCheckbox
          checked={row.getIsSelected()}
          onToggle={() => row.toggleSelected()}
          ariaLabel={`Chọn dòng ${row.id}`}
        />
      ) : colDef?.cell ? (
        colDef.cell(row.original)
      ) : colDef ? (
        formatCell(row.original, colDef)
      ) : null}
    </td>
  );
};

export default BodyCell;
