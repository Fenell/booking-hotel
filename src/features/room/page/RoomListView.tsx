import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  DataGrid,
  type DataGridRef,
  type PersistedColumnState,
} from "@shared/components/DataGrid";
import { Button } from "@shared/components/UI";
import Popover from "@shared/components/Popover/Popover";
import { DataGridColumnSetting } from "@shared/components/Settings/DataGridColumnSetting";
import CreateAndUpdateRoom from "../components/CreateAndUpdateRoom";
import createRoomCol from "../components/createRoomCol";
import { useRoomLogic } from "../hook/useRoomLogic";
import type { RoomModel } from "../types/room.type";
import roomStyle from "../style/room.module.css";

const RoomListView = () => {
  const logic = useRoomLogic();
  const gridRef = useRef<DataGridRef<RoomModel>>(null);
  const [colState, setColState] = useState<PersistedColumnState[]>([]);

  // Đọc trạng thái cột ngay trước lúc popover mở — trong handler sự kiện nên
  // truy cập ref ở đây là hợp lệ (và grid chắc chắn đã mount xong).
  const handleColumnPanelOpen = useCallback((open: boolean) => {
    if (open) setColState(gridRef.current?.getColumnState() ?? []);
  }, []);

  const handleToggleColumn = useCallback((field: string, visible: boolean) => {
    gridRef.current?.setColumnVisible(field, visible);
    setColState((prev) =>
      prev.map((col) => (col.field === field ? { ...col, visible } : col)),
    );
  }, []);

  const columns = useMemo(
    () =>
      createRoomCol({
        onEdit: logic.handleEditRoom,
        onStatusUpdated: logic.applyRoomUpdate,
      }),
    [logic.handleEditRoom, logic.applyRoomUpdate],
  );

  return (
    <>
      <AnimatePresence>
        {logic.isOpen && (
          <CreateAndUpdateRoom onSuccess={logic.applyRoomUpdate} />
        )}
      </AnimatePresence>
      <div className={roomStyle.box}>
        <div className={roomStyle.actionBar}>
          <Button
            noAnimation
            status="primary"
            onClick={() => logic.openDialog(true)}
          >
            Thêm mới
          </Button>
          <Popover
            noAnimation
            status="primary"
            btnProps={{ typeButton: "outline" }}
            position="bottom-right"
            onOpenChange={handleColumnPanelOpen}
            content={
              <DataGridColumnSetting
                colState={colState}
                columns={columns}
                onToggle={handleToggleColumn}
              />
            }
          >
            <i className="fa-regular fa-list"></i>
          </Popover>
        </div>

        {/* Bọc một lớp flex có min-width/min-height 0: nếu thiếu, min-content
            của bảng lan ngược lên làm thanh cuộn ngang nhảy ra ngoài page
            (xem DataGrid/README mục 11). */}
        <div className={roomStyle.gridWrap}>
          <DataGrid<RoomModel>
            ref={gridRef}
            gridKey="room"
            /* Nút chọn cột đã nằm ngoài, trên thanh hành động của trang */
            enableColumnChooser={false}
            className={roomStyle.grid}
            columns={columns}
            data={logic.data?.data ?? []}
            getRowId={(row) => row.id}
            isLoading={logic.isPending}
            pageSizeOptions={[20, 50, 100]}
            footerLabel="Tổng"
            emptyMessage="Chưa có phòng nào"
          />
        </div>
      </div>
    </>
  );
};

export default RoomListView;
