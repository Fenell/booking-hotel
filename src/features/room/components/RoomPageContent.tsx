import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";
import { AgGridReact } from "ag-grid-react";
import { useRoomGrid } from "../hook/useRoomGrid";
import { AG_GRID_LOCALE_VN } from "@shared/utils/vi-VN";
import { useRoomLogic } from "../hook/useRoomLogic";

const RoomPageContent = () => {
  const logic = useRoomLogic();

  const { colDefs, defaultColDef, paginationPageSizeSelector } = useRoomGrid({
    onEditRoom: logic.handleEditRoom,
    onToogleStatus: logic.handleToogle,
  });

  const localText = AG_GRID_LOCALE_VN;
  return (
    <>
      {logic.isOpen && <CreateAndUpdateRoom />}
      <div className={roomStyle.box}>
        <div className={roomStyle.actionBar}>
          <Button
            noAnimation
            status="success"
            onClick={() => logic.openDialog(true)}
          >
            Thêm mới
          </Button>
        </div>
        <div className={roomStyle.boxData}>
          <AgGridReact
            loading={logic.isPending}
            localeText={localText}
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
