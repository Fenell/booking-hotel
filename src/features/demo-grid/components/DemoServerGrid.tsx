import { useMemo, useRef, useState } from "react";
import { DataGrid, useServerGrid } from "@shared/components/DataGrid";
import type { DataGridRef } from "@shared/components/DataGrid";
import { Button } from "@shared/components/UI";
import { useToast } from "@shared/hooks/useToast";
import demoStyle from "../style/demoGrid.module.css";
import { createDemoRoomCols } from "./demoRoomCols";
import type { DemoRoom } from "./demoRoomCols";
import { fetchFakeRooms } from "./fakeData";

/**
 * MẪU CHUẨN — Grid SERVER-SIDE, chiều cao cố định.
 *
 * Dữ liệu: server giả lập 1.000 phòng (fakeData.ts) qua option `fetcher` của
 * useServerGrid — mỗi thao tác trang/sort/lọc gọi "server" đúng một lần,
 * grid chỉ giữ MỘT trang dữ liệu.
 *
 * Áp dụng vào API thật, chọn một trong hai:
 * 1. Endpoint dynamic: bỏ `fetcher`, truyền `tableNames` (+ `serverFields`
 *    khi tên cột lệch quy tắc camelToSnake).
 * 2. API bất kỳ: giữ `fetcher`, thay ruột fetchFakeRooms bằng axios của bạn.
 */
const DemoServerGrid = () => {
  const toast = useToast();
  const gridRef = useRef<DataGridRef<DemoRoom>>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  const columns = useMemo(
    () =>
      createDemoRoomCols({
        onEdit: (row) => toast.info(`Sửa phòng: ${row.roomName}`),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const grid = useServerGrid<DemoRoom>({
    queryKey: "demo-grid-rooms-fake",
    fetcher: fetchFakeRooms, // ← thay bằng API thật khi áp dụng
    initialPageSize: 20,
  });

  // Dòng tổng: tính trên trang hiện tại làm minh họa —
  // server thật trả tổng toàn tập thì đưa số đó vào đây
  const footerData = useMemo(
    () => ({
      currentPrice: grid.data.reduce((s, r) => s + (r.currentPrice ?? 0), 0),
      priceWeekend: grid.data.reduce((s, r) => s + (r.priceWeekend ?? 0), 0),
    }),
    [grid.data],
  );

  const handleEditFirstRow = () => {
    const first = grid.data[0];
    if (!first) return;
    // updateRow ghi vào cache để UI phản ánh NGAY (optimistic). Với server
    // thật: lưu server xong thì refetch mới giữ được thay đổi — demo này server
    // giả không được ghi nên refetch/đổi trang sẽ trả về giá trị gốc.
    grid.updateRow(first.id, {
      currentPrice: (first.currentPrice ?? 0) + 10_000,
    });
    gridRef.current?.flashRow(first.id);
  };

  return (
    <section className={demoStyle.section}>
      <h2 className={demoStyle.sectionTitle}>
        Grid 1 — Server-side (giả lập 1.000 phòng, độ trễ 350ms)
      </h2>
      <p className={demoStyle.sectionNote}>
        Phân trang / sort / lọc chạy phía "server" — grid chỉ giữ một trang.
        Chiều cao cố định 520px; kéo giãn cột vượt khung sẽ hiện thanh cuộn
        ngang, cột ghim trái/phải vẫn dính hai mép.
      </p>

      <div className={demoStyle.actionBar}>
        <Button
          status="default"
          small
          noAnimation
          onClick={() => gridRef.current?.deselectAll()}
        >
          Bỏ chọn tất cả
        </Button>
        <Button
          status="info"
          small
          noAnimation
          onClick={() => gridRef.current?.exportCsv({ fileName: "phong.csv" })}
        >
          Xuất CSV
        </Button>
        <Button
          status="warning"
          small
          noAnimation
          onClick={() => gridRef.current?.resetColumns()}
        >
          Reset cột
        </Button>
        <Button status="success" small noAnimation onClick={handleEditFirstRow}>
          +10.000đ giá dòng đầu
        </Button>
        {selectedCount > 0 && (
          <span className={demoStyle.selectedBadge}>
            Đã chọn {selectedCount} dòng
          </span>
        )}
      </div>

      <DataGrid<DemoRoom>
        ref={gridRef}
        gridKey="demo-room"
        columns={columns}
        data={grid.data}
        getRowId={(row) => row.id}
        rowCount={grid.total}
        state={grid.gridState}
        onStateChange={grid.setGridState}
        isLoading={grid.isLoading}
        isFetching={grid.isFetching}
        enableSelection
        onSelectionChange={(ids) =>
          setSelectedCount(Object.values(ids).filter(Boolean).length)
        }
        footerData={footerData}
        footerLabel="Tổng"
        height={520}
      />
    </section>
  );
};

export default DemoServerGrid;
