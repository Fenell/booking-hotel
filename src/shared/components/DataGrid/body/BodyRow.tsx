import classNames from "classnames";
import type { Row } from "@tanstack/react-table";
import { useGridContext } from "../core/gridContext";
import styles from "../styles/body.module.css";
import BodyCell from "./BodyCell";

type BodyRowProps<T> = { row: Row<T>; rowIndex: number };

const BodyRow = <T,>({ row, rowIndex }: BodyRowProps<T>) => {
  const ctx = useGridContext<T>();
  const userClass = ctx.rowClassName?.(row.original);

  return (
    <tr
      data-row-id={row.id}
      className={classNames(
        styles.tr,
        {
          [styles.trSelected]: row.getIsSelected(),
          [styles.trClickable]: !!ctx.onRowClick,
        },
        userClass,
      )}
      onClick={ctx.onRowClick ? (e) => ctx.onRowClick?.(row.original, e) : undefined}
      onDoubleClick={
        ctx.onRowDoubleClick
          ? (e) => ctx.onRowDoubleClick?.(row.original, e)
          : undefined
      }
    >
      {row.getVisibleCells().map((cell, colIndex) => (
        <BodyCell<T>
          key={cell.id}
          cell={cell}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
      ))}
    </tr>
  );
};

export default BodyRow;
