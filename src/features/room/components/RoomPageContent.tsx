import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";
import { AgGridReact } from "ag-grid-react";
import { useRoomGrid } from "../hook/useRoomGrid";

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
  } = useRoomGrid();
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
            onGridReady={onGridReady}
            getRowId={(params) => params.data.id}
            columnDefs={colDefs}
            rowData={data?.data}
            defaultColDef={defaultColDef}
          />
        </div>
      </div>
    </>
  );
};

export default RoomPageContent;
