import { useCallback, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  DataGrid,
  type DataGridRef,
  type PersistedColumnState,
} from "@shared/components/DataGrid";
import { Button } from "@shared/components/UI";
import Popover from "@shared/components/Popover/Popover";
import { DataGridColumnSetting } from "@shared/components/Settings/DataGridColumnSetting";
import CreateAndUpdateService from "../components/CreateAndUpdateService";
import { useServiceGrid } from "../hook/useServiceGrid";
import { useServiceContext } from "../context/ServiceContext";
import type { ServiceResponse } from "../types/service.type";
import serviceStyle from "../style/service.module.css";

const ServiceListView = () => {
  const { columns, grid } = useServiceGrid();
  const { isOpen, openOrCloseDialog } = useServiceContext();

  const gridRef = useRef<DataGridRef<ServiceResponse>>(null);
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

  return (
    <>
      <AnimatePresence>{isOpen && <CreateAndUpdateService />}</AnimatePresence>
      <div className={serviceStyle.box}>
        <div className={serviceStyle.actionBar}>
          <Button
            status="success"
            noAnimation
            onClick={() => openOrCloseDialog(true)}
          >
            Thêm mới
          </Button>
          <Popover
            noAnimation
            status="success"
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
        <div className={serviceStyle.gridWrap}>
          <DataGrid<ServiceResponse>
            ref={gridRef}
            gridKey="service"
            /* Nút chọn cột đã nằm ngoài, trên thanh hành động của trang */
            enableColumnChooser={false}
            className={serviceStyle.grid}
            columns={columns}
            data={grid.data}
            getRowId={(row) => row.id}
            rowCount={grid.total}
            state={grid.gridState}
            onStateChange={grid.setGridState}
            isLoading={grid.isLoading}
            isFetching={grid.isFetching}
            pageSizeOptions={[20, 50, 100]}
            emptyMessage="Chưa có dịch vụ nào"
          />
        </div>
      </div>
    </>
  );
};

export default ServiceListView;
