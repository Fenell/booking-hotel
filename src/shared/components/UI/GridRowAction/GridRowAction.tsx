import type { ReactNode } from "react";
import Tooltip from "../Tooltip/Tooltip";
import actionRow from "./GridRowAction.module.css";

export type GridRowActionProps<T> = {
  data: T;
  onClick?: (row: T) => void;
};

type GridActionType = "edit" | "delete";

type ActionCellRendererParams<T> = {
  actions: GridActionType[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isPending?: boolean;
};

export type ActionCellRendererProps<T> = GridRowActionProps<T> &
  ActionCellRendererParams<T>;

type ActionConfig<T> = {
  key: GridActionType;
  label: string;
  icon: ReactNode;
  onClick?: (row: T) => void;
};

const getActionConfig = <T,>(
  params: ActionCellRendererParams<T>,
): Record<GridActionType, ActionConfig<T>> => ({
  edit: {
    key: "edit",
    label: "Chỉnh sửa",
    icon: <i className="fa-light fa-pen-to-square fa-xl"></i>,
    onClick: params.onEdit,
  },
  delete: {
    key: "delete",
    label: "Xoá",
    icon: <i className="fa-light fa-trash fa-xl"></i>,
    onClick: params.onDelete,
  },
});

const GridRowAction = <T,>({
  data,
  actions,
  onEdit,
  onDelete,
}: ActionCellRendererProps<T>) => {
  if (!data) return null;
  const actionConfigs = getActionConfig<T>({ actions, onEdit, onDelete });

  return (
    <div className={actionRow.actions}>
      {actions.map((action) => {
        const config = actionConfigs[action];
        if (!config.onClick) return null;
        return (
          // Tên hành động nằm ở tooltip thay vì in cạnh icon, nên cột Thao tác
          // đỡ chật. Tooltip render qua portal nên không bị ô lưới cắt mất.
          <Tooltip key={config.key} content={config.label}>
            <button
              type="button"
              aria-label={config.label}
              className={actionRow.actionRow}
              onClick={() => data && config.onClick?.(data)}
            >
              {config.icon}
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default GridRowAction;
