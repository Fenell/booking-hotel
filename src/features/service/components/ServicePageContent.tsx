import { AgGridReact } from "ag-grid-react";
import { useGridService } from "../hook/useGridService";
import { useServiceContext } from "../store/serviceContext";
import CreateAndUpdateService from "./CreateAndUpdateService";
import serviceStyle from "../style/service.module.css";
import { Button } from "@shared/components/UI";
import { AnimatePresence } from "motion/react";
import DataGrid from "@shared/components/DataGrid";
import type { ServiceResponse } from "../types/service.type";

const ServicePageContent = () => {
  const { colDefs, defaultColDef, data, isPending } = useGridService();
  const { isOpen, openOrCloseDialog } = useServiceContext();
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
        </div>
        <DataGrid<ServiceResponse>
          isLoading={isPending}
          contentHeight={500}
          enableColumnFilters={false}
          columns={colDefs}
          data={data?.data ?? []}
          serverSide={false}
          pageSizeOptions={[5, 50, 100]}
        />
      </div>
    </>
  );
};

export default ServicePageContent;
