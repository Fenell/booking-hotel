import type { ReactNode } from "react";
import actionRow from "./GridRowAction.module.css";
import type { CustomCellRendererProps } from "ag-grid-react";

export type GridRowActionProps<T extends object> =
  CustomCellRendererProps<T> & {
    onClick: (row: T) => void;
  };

type GridActionType = "edit" | "delete";

type ActionCellRendererParams<T> = {
  actions: GridActionType[];
  onEdit?: (row: T) => void;
};

export type ActionCellRendererProps<T> = CustomCellRendererProps<T> &
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
    label: "Chỉnh sửa",
    icon: <i className="fa-light fa-pen-to-square fa-xl"></i>,
    onClick: params.onEdit,
  },
});

const GridRowAction = <T,>({
  data,
  actions,
  onEdit,
}: ActionCellRendererProps<T>) => {
  if (!data) return null;
  const actionConfigs = getActionConfig<T>({ actions, onEdit });
  return (
    <div>
      {actions.map((action) => {
        const config = actionConfigs[action];
        if (!config.onClick) return null;
        return (
          <button
            key={config.key}
            className={actionRow.actionRow}
            onClick={() => data && config.onClick?.(data)}
          >
            {config.icon}
            {config.label}
          </button>
        );
      })}
    </div>
  );
};

export default GridRowAction;
