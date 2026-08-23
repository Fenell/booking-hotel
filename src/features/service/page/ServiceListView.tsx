import { useServiceGrid } from "../hook/useServiceGrid";
import { useServiceContext } from "../context/ServiceContext";
import CreateAndUpdateService from "../components/CreateAndUpdateService";
import serviceStyle from "../style/service.module.css";
import { Button } from "@shared/components/UI";
import { AnimatePresence } from "motion/react";

import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  Freeze,
  GridComponent,
  Inject,
  Page,
  Resize,
  type PageSettingsModel,
} from "@syncfusion/ej2-react-grids";
import type { ServiceResponse } from "../types/service.type";
import { ColumnSetting } from "@shared/components/Settings/ColumnSetting";
import Popover from "@shared/components/Popover/Popover";
import ActionServiceCol from "../components/ActionServiceCol";
import { useRef } from "react";
import Checkbox from "@shared/components/UI/Checkbox/Checkbox";

const ServiceListView = () => {
  const { colConfig, pageOptions, data, setColConfig } = useServiceGrid();
  const { isOpen, openOrCloseDialog } = useServiceContext();

  const gridRef = useRef<GridComponent | null>(null);

  const checkBoxTemplate = (props: ServiceResponse) => {
    return <Checkbox isChecked={props.isFee} />;
  };
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
            content={
              <ColumnSetting
                gridRef={gridRef}
                girdKey="service"
                onChangeCol={(newCols) => setColConfig(newCols)}
              />
            }
            status="success"
            position="bottom-right"
          >
            <i className="fa-regular fa-list"></i>
          </Popover>
        </div>
        {/* <DataGrid<ServiceResponse>
          isLoading={isPending}
          // contentHeight={500}
          enableResize
          enableSort
          enablePinning
          getRowId={(row) => row.id}
          columns={colDefs}
          data={data?.data ?? []}
          serverSide={false}
          pageSizeOptions={[20, 50, 100]}
        /> */}
        <div style={{ minWidth: 0 }}>
          <GridComponent
            ref={(g) => (gridRef.current = g)}
            dataSource={data?.data}
            allowResizing={true}
            width="100%"
            height="100%"
            allowPaging={true}
            pageSettings={pageOptions}
          >
            {/* <ColumnDirective type="checkbox" width="10" /> */}
            <ColumnsDirective>
              {colConfig.map((a) => {
                if (a.type === "boolean") {
                  return (
                    <ColumnDirective
                      field={a.field}
                      headerText={a.headerText}
                      width={a.width}
                      visible={a.visible}
                      textAlign={a.textAlign}
                      template={checkBoxTemplate}
                    />
                  );
                }
                return (
                  <ColumnDirective
                    field={a.field}
                    headerText={a.headerText}
                    width={a.width}
                    visible={a.visible}
                    textAlign={a.textAlign}
                    isPrimaryKey={a.isPrimaryKey}
                    type={a.type}
                    format={a.format}
                  />
                );
              })}
              <ColumnDirective
                headerText="Thao tác"
                width="100"
                freeze="Right"
                template={ActionServiceCol}
              />
            </ColumnsDirective>
            <Inject services={[Resize, Page, Freeze, Edit]} />
          </GridComponent>
        </div>
      </div>
    </>
  );
};

export default ServiceListView;
