import { useGridContext } from "../core/gridContext";
import FloatingFilterRow from "./FloatingFilterRow";
import HeaderCell from "./HeaderCell";

/** <thead>: hàng tiêu đề + hàng floating filter (nếu bật) */
const HeaderRow = <T,>() => {
  const ctx = useGridContext<T>();
  return (
    <thead>
      {ctx.table.getHeaderGroups().map((hg) => (
        <tr key={hg.id}>
          {hg.headers.map((header) => (
            <HeaderCell<T> key={header.id} header={header} />
          ))}
        </tr>
      ))}
      {ctx.enableFilter && ctx.hasFilterRow && <FloatingFilterRow<T> />}
    </thead>
  );
};

export default HeaderRow;
