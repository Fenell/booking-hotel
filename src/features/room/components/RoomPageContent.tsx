import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";
import { AgGridReact } from "ag-grid-react";
import { useRoomGrid } from "../hook/useRoomGrid";
import { AG_GRID_LOCALE_VN } from "@shared/utils/vi-VN";
import { useRoomLogic } from "../hook/useRoomLogic";
import { useGridTheme } from "@shared/lib/agGrid.config";
import { AnimatePresence } from "motion/react";

import Popover from "@shared/components/Popover/Popover";
import { ColumnSetting } from "@shared/components/Settings/ColumSetting";
import type { RoomModel } from "@shared/types/room";

const RoomPageContent = () => {
  const logic = useRoomLogic();

  const { colDefs, defaultColDef, paginationPageSizeSelector, setColConfig } =
    useRoomGrid({
      onEditRoom: logic.handleEditRoom,
      onToogleStatus: logic.handleToogle,
      isProcessingUpdateStt: logic.isCallApi,
    });

  const theme = useGridTheme();

  const localText = AG_GRID_LOCALE_VN;
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
        <div className={roomStyle.boxData}>
          <AgGridReact
            loading={logic.isPending}
            localeText={localText}
            theme={theme}
            onGridReady={logic.onGridReady}
            getRowId={(params) => params.data.id}
            columnDefs={colDefs}
            rowData={logic.data?.data}
            pagination={true}
            paginationPageSizeSelector={paginationPageSizeSelector}
            paginationPageSize={50}
            defaultColDef={defaultColDef}
          />
        </div>
      </div>
    </>
  );
};

export default RoomPageContent;
