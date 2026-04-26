import type { ServiceResponse } from "../types/service.type";
import serviceStyle from "../style/service.module.css";

type ActionServiceColProps = {
  row: ServiceResponse;
  onClick: (id: string) => void;
};

const ActionServiceCol = ({ row, onClick }: ActionServiceColProps) => {
  // const { id } = data?.;
  return (
    <button className={serviceStyle.actionRow} onClick={() => onClick(row.id)}>
      <i className="fa-light fa-pen-to-square fa-xl"></i>
      Chỉnh sửa
    </button>
  );
};

export default ActionServiceCol;
