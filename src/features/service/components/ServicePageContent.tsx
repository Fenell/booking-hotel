import { AgGridReact } from "ag-grid-react";
import { useGridService } from "../hook/useGridService";
import { useServiceContext } from "../store/serviceContext";
import CreateAndUpdateService from "./CreateAndUpdateService";
import serviceStyle from "../style/service.module.css";
import { Button } from "@shared/components/UI";
import { AnimatePresence } from "motion/react";

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
        <AgGridReact
          loading={isPending}
          columnDefs={colDefs}
          rowData={data?.data}
          defaultColDef={defaultColDef}
        />
      </div>
    </>
  );
};

export default ServicePageContent;
