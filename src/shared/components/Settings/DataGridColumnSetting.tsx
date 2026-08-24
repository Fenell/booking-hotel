import Checkbox from "../UI/Checkbox/Checkbox";
import type {
  ColumnDef,
  PersistedColumnState,
} from "@shared/components/DataGrid";

export type DataGridColumnSettingProps<T> = {
  /** Trạng thái cột hiện tại, lấy từ `gridRef.current.getColumnState()` */
  colState: PersistedColumnState[];
  /** Dùng để lấy tiêu đề cột */
  columns: ColumnDef<T>[];
  onToggle: (field: string, visible: boolean) => void;
};

/**
 * Bảng chọn ẩn/hiện cột cho DataGrid, đặt NGOÀI grid (thường nhét vào Popover
 * trên thanh hành động của trang). Bản thân nó chỉ hiển thị: việc đọc/ghi trạng
 * thái cột do nơi gọi làm qua API ref của DataGrid (grid tự lo phần lưu theo
 * `gridKey`).
 *
 * Cố ý không giữ state và không nhận ref: đọc ref lúc render là không an toàn,
 * nên nơi gọi phải đọc trong handler sự kiện rồi truyền xuống.
 */
export const DataGridColumnSetting = <T,>({
  colState,
  columns,
  onToggle,
}: DataGridColumnSettingProps<T>) => {
  const labelOf = (field: string) =>
    columns.find((col) => col.field === field)?.headerText ?? field;

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        width: "350px",
        padding: "6px",
      }}
    >
      {colState.map((col) => (
        <Checkbox
          key={col.field}
          index={col.field}
          isChecked={col.visible}
          label={labelOf(col.field)}
          onChecked={(e) => onToggle(col.field, e.target.checked)}
          style={{ flex: "0 0 160px" }}
        />
      ))}
    </div>
  );
};
