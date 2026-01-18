import type { CustomCellRendererProps } from "ag-grid-react";
import type { ServiceResponse } from "../types/service.type";
import serviceStyle from "../style/service.module.css";

export type ActionServiceColProps = CustomCellRendererProps<ServiceResponse> & {
  onClick: () => void;
};

const ActionServiceCol = ({ data, onClick }: ActionServiceColProps) => {
  // const { id } = data?.;
  return (
    // <div style={{ height: "100%" }}>
    // </div>
    <button className={serviceStyle.actionRow} onClick={onClick}>
      <i className="fa-light fa-pen-to-square fa-xl"></i>
      Chỉnh sửa
    </button>
  );
};

export default ActionServiceCol;
