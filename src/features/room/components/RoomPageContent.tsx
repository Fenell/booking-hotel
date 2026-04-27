import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";
import { useRoomGrid } from "../hook/useRoomGrid";
import { AG_GRID_LOCALE_VN } from "@shared/utils/vi-VN";
import { useRoomLogic } from "../hook/useRoomLogic";
import { useGridTheme } from "@shared/lib/agGrid.config";
import { AnimatePresence } from "motion/react";

import Popover from "@shared/components/Popover/Popover";
import { ColumnSetting } from "@shared/components/Settings/ColumSetting";
import type { RoomModel } from "@shared/types/room";
import DataGrid from "@shared/components/DataGrid";

const RoomPageContent = () => {
  const logic = useRoomLogic();

  const { colDefs, paginationPageSizeSelector, setColConfig } = useRoomGrid({
    onEditRoom: logic.handleEditRoom,
    onToogleStatus: logic.handleToogle,
    isProcessingUpdateStt: logic.isCallApi,
  });
  // console.log(colDefs);

  return (
    <>
      <AnimatePresence>
        {logic.isOpen && (
          <CreateAndUpdateRoom gridApi={logic.gridApiRef.current} />
        )}
      </AnimatePresence>
      <div className={roomStyle.box}>
        <div className={roomStyle.actionBar}>
          <Button
            noAnimation
            status="success"
            onClick={() => logic.openDialog(true)}
          >
            Thêm mới
          </Button>
          <Popover
            noAnimation
            content={
              <ColumnSetting<RoomModel>
                girdKey="room"
                onChangeCol={(newCols) => setColConfig(newCols)}
              />
            }
            status="success"
            position="bottom-right"
          >
            <i className="fa-regular fa-list"></i>
          </Popover>
        </div>

        <DataGrid<RoomModel>
          isLoading={logic.isPending}
          onGridReady={logic.onGridReady}
          getRowId={(row) => row.id}
          columns={colDefs}
          enableResize
          enablePinning
          enableSort
          showSummary
          data={logic.data?.data ?? []}
          pageSizeOptions={paginationPageSizeSelector}
        />
      </div>
    </>
  );
};

export default RoomPageContent;
