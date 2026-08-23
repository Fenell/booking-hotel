import type { ServiceResponse } from "../types/service.type";
import serviceStyle from "../style/service.module.css";
import { useServiceContext } from "../context/ServiceContext";
import { useCallback } from "react";

const ActionServiceCol = (row: ServiceResponse) => {
  // const { id } = data?.;
  const { openOrCloseDialog } = useServiceContext();

  const handleClickAction = useCallback(
    (id?: string) => {
      openOrCloseDialog(true, id);
    },
    [openOrCloseDialog],
  );
  return (
    <button
      className={serviceStyle.actionRow}
      onClick={() => handleClickAction(row.id)}
    >
      <i className="fa-light fa-pen-to-square fa-xl"></i>
      Chỉnh sửa
    </button>
  );
};

export default ActionServiceCol;
