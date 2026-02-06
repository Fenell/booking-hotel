import Switch from "@shared/components/UI/Switch/Switch";
import type { RoomModel } from "@shared/types/room";
import type { CustomDetailCellRendererProps } from "ag-grid-react";

export type StatusSwitchProp = CustomDetailCellRendererProps<RoomModel> & {
  onToggle: (checked: boolean) => void;
};

const StatusSwitch = ({ value, onToggle }: StatusSwitchProp) => {
  const checked: boolean = value === 1;
  return <Switch checked={checked} onToggle={(e) => onToggle(e)} />;
};

export default StatusSwitch;
