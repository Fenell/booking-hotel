import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";
import { useRoomGrid } from "../hook/useRoomGrid";
import { useRoomLogic } from "../hook/useRoomLogic";
import { AnimatePresence } from "motion/react";

import Popover from "@shared/components/Popover/Popover";
import { ColumnSetting } from "@shared/components/Settings/ColumSetting";
import type { RoomModel } from "@shared/types/room";
import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  Freeze,
  GridComponent,
  Inject,
  Page,
  Resize,
} from "@syncfusion/ej2-react-grids";

import StatusSwitch from "./StatusSwitch";
import { useRef, useState } from "react";
import GridRowAction from "@shared/components/UI/GridRowAction/GridRowAction";

const RoomPageContent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const logic = useRoomLogic();
  const gridRef = useRef<GridComponent | null>(null);
  const { pageOptions, colConfig, setColConfig } = useRoomGrid({
    onEditRoom: logic.handleEditRoom,
  });
  // console.log(colDefs);

  const updateData = (dataUpdated: RoomModel) => {
    const updatedDtSource = gridRef.current!.dataSource.map((c) =>
      c.id === dataUpdated.id ? { ...c, ...dataUpdated } : c,
    );
    gridRef.current!.dataSource = updatedDtSource;
  };

  const handleSuccessUpdateStatus = (
    roomId: string,
    updatedData: RoomModel,
  ) => {
    updateData(updatedData);
  };

  // Track loading state of each row
  const handleLoadingChange = (roomId: string, isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  const statusTemplate = (props: RoomModel) => (
    <StatusSwitch
      data={props}
      onSuccessUpdateStaus={(data) => handleSuccessUpdateStatus(props.id, data)}
      onLoadingChange={(isLoading) => handleLoadingChange(props.id, isLoading)}
    />
  );

  const actionTempplate = (props: RoomModel) => (
    <GridRowAction
      data={props}
      actions={["edit"]}
      onEdit={(row) => logic.handleEditRoom(row.id)}
    />
  );
  const handleUpdateSuccess = (data: RoomModel): void => {
    updateData(data);
  };

  return (
    <>
      <AnimatePresence>
        {logic.isOpen && (
          <CreateAndUpdateRoom
            onSuccess={(data) => handleUpdateSuccess(data)}
          />
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
              <ColumnSetting
                gridRef={gridRef}
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

        {/* <DataGrid<RoomModel>
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
        /> */}
        <div style={{ minWidth: 0 }}>
          <GridComponent
            ref={(g) => (gridRef.current = g)}
            dataSource={logic.data?.data}
            allowResizing={true}
            allowSelection={true}
            width="100%"
            height="100%"
            allowPaging={true}
            pageSettings={pageOptions}
          >
            <ColumnsDirective>
              {colConfig.map((a) => (
                <ColumnDirective
                  field={a.field}
                  headerText={a.headerText}
                  width={a.width}
                  visible={a.visible}
                  textAlign={a.textAlign}
                  isPrimaryKey={a.isPrimaryKey}
                  displayAsCheckBox={a.displayAsCheckBox}
                  format={"N0"}
                />
              ))}
              <ColumnDirective
                headerText="Trạng thái"
                width="120"
                template={statusTemplate}
              />
              <ColumnDirective
                template={actionTempplate}
                headerText="Thao tác"
                width="120"
                freeze="Right"
              />
            </ColumnsDirective>
            <Inject services={[Resize, Page, Freeze, Edit]} />
          </GridComponent>
        </div>
      </div>
    </>
  );
};

export default RoomPageContent;
