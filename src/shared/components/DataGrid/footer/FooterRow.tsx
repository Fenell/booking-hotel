import classNames from "classnames";
import { SELECT_COL_ID } from "../core/constants";
import { useGridContext } from "../core/gridContext";
import styles from "../styles/footer.module.css";
import { formatN0 } from "../utils/formatCell";
import { getNestedValue } from "../utils/getNestedValue";
import { getPinnedEdge, getPinnedStyle } from "../utils/pinning";
import type { ColumnDef } from "../types/column";

/** Tính aggregate client — CHỈ dùng khi footerData không có giá trị cho field */
const computeAggregate = <T,>(colDef: ColumnDef<T>, rows: T[]): number | undefined => {
  const agg = colDef.aggregate;
  if (!agg) return undefined;
  if (typeof agg === "function") return agg(rows);

  const numbers = rows
    .map((r) => getNestedValue(r, colDef.field))
    .filter((v): v is number => typeof v === "number");

  switch (agg) {
    case "sum":
      return numbers.reduce((s, v) => s + v, 0);
    case "avg":
      return numbers.length
        ? numbers.reduce((s, v) => s + v, 0) / numbers.length
        : 0;
    case "count":
      return rows.length;
  }
};

/** Dòng tổng — pinned bottom kiểu AG Grid */
const FooterRow = <T,>() => {
  const ctx = useGridContext<T>();
  const headers = ctx.table.getHeaderGroups().at(-1)?.headers ?? [];

  // Cột đầu tiên hiển thị (không phải cột checkbox) — nơi đặt footerLabel
  const firstDataColId = headers.find((h) => h.column.id !== SELECT_COL_ID)
    ?.column.id;

  return (
    <tfoot>
      <tr>
        {headers.map((header) => {
          const { column } = header;
          const colDef = ctx.colDefFor(column.id);
          const edge = getPinnedEdge(column);

          let content: string | number | undefined =
            colDef && ctx.footerData?.[colDef.field] != null
              ? ctx.footerData[colDef.field]
              : colDef
                ? computeAggregate(colDef, ctx.data)
                : undefined;

          if (typeof content === "number") {
            // formatN0 hiển thị đúng cả giá trị 0 (formatNumber của repo trả rỗng)
            content = colDef?.format === "N0" ? formatN0(content) : String(content);
          }

          const showLabel =
            content == null && column.id === firstDataColId && ctx.footerLabel;

          return (
            <td
              key={header.id}
              className={classNames(styles.tf, {
                [styles.tfPinned]: !!edge.pinned,
                [styles.edgeLeft]: edge.isLastLeft,
                [styles.edgeRight]: edge.isFirstRight,
                [styles.alignRight]: colDef?.align === "right",
                [styles.alignCenter]: colDef?.align === "center",
              })}
              style={{ width: header.getSize(), ...getPinnedStyle(column) }}
            >
              {showLabel ? ctx.footerLabel : (content ?? "")}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
};

export default FooterRow;
