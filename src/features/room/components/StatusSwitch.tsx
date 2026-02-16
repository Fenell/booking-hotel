import Switch from "@shared/components/UI/Switch/Switch";
import type { RoomModel } from "@shared/types/room";
import type { CustomDetailCellRendererProps } from "ag-grid-react";

export type StatusSwitchProp = CustomDetailCellRendererProps<RoomModel> & {
  onToggle: (checked: boolean) => void;
  isLoading: boolean;
};

const StatusSwitch = ({ value, isLoading, onToggle }: StatusSwitchProp) => {
  const checked: boolean = value === 1;
  return (
    <Switch
      checked={checked}
      onToggle={(e) => onToggle(e)}
      isLoading={isLoading}
    />
  );
};

export default StatusSwitch;
