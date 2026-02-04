import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";
import { AgGridReact } from "ag-grid-react";
import { useRoomGrid } from "../hook/useRoomGrid";
import { AG_GRID_LOCALE_VN } from "@shared/utils/vi-VN";

const RoomPageContent = () => {
  const {
    colDefs,
    defaultColDef,
    data,
    isPending,
    isOpen,
    openDialog,
    gridApiRef,
    onGridReady,
    paginationPageSizeSelector,
  } = useRoomGrid();

  const localText = AG_GRID_LOCALE_VN;
  return (
    <>
      {isOpen && <CreateAndUpdateRoom />}
      <div className={roomStyle.box}>
        <div className={roomStyle.actionBar}>
          <Button noAnimation status="success" onClick={() => openDialog(true)}>
            Thêm mới
          </Button>
        </div>
        <div className={roomStyle.boxData}>
          <AgGridReact
            loading={isPending}
            localeText={localText}
            onGridReady={onGridReady}
            getRowId={(params) => params.data.id}
            columnDefs={colDefs}
            rowData={data?.data}
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
