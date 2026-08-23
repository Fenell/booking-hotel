import { useGridContext } from "../core/gridContext";
import BodyRow from "./BodyRow";

/** <tbody> — EmptyState render ở tầng DataGrid (ngoài table) để không vỡ layout cột */
const BodyRows = <T,>() => {
  const ctx = useGridContext<T>();
  const rows = ctx.table.getRowModel().rows;

  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <BodyRow<T> key={row.id} row={row} rowIndex={rowIndex} />
      ))}
    </tbody>
  );
};

export default BodyRows;
