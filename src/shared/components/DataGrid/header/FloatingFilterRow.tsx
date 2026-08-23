import classNames from "classnames";
import { useGridContext } from "../core/gridContext";
import NumberFilter from "../filters/NumberFilter";
import TextFilter from "../filters/TextFilter";
import styles from "../styles/filters.module.css";
import { getPinnedEdge, getPinnedStyle } from "../utils/pinning";

/** Hàng ô lọc dưới header (floating filter kiểu AG Grid) */
const FloatingFilterRow = <T,>() => {
  const ctx = useGridContext<T>();
  const headers = ctx.table.getHeaderGroups().at(-1)?.headers ?? [];

  return (
    <tr>
      {headers.map((header) => {
        const { column } = header;
        const colDef = ctx.colDefFor(column.id);
        const edge = getPinnedEdge(column);
        const filter = colDef?.filter;

        return (
          <th
            key={header.id}
            className={classNames(styles.filterCell, {
              [styles.filterCellPinned]: !!edge.pinned,
              [styles.edgeLeft]: edge.isLastLeft,
              [styles.edgeRight]: edge.isFirstRight,
            })}
            style={{ width: header.getSize(), ...getPinnedStyle(column) }}
          >
            {filter && filter.type === "text" && <TextFilter field={column.id} />}
            {filter && filter.type === "number" && (
              <NumberFilter field={column.id} operators={filter.operators} />
            )}
          </th>
        );
      })}
    </tr>
  );
};

export default FloatingFilterRow;
