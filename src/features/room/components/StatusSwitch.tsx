import Switch from "@shared/components/UI/Switch/Switch";
import { useToast } from "@shared/hooks/useToast";
import type { RoomModel } from "../types/room.type";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { changeStatus } from "../api/room.api";

export type StatusSwitchProp = {
  data: RoomModel;
  onSuccessUpdateStaus: (data: RoomModel) => void;
  onLoadingChange: (isLoading: boolean) => void;
};

const StatusSwitch = ({
  data,
  onLoadingChange,
  onSuccessUpdateStaus,
}: StatusSwitchProp) => {
  const checked: boolean = data.status === 1;
  const toast = useToast();

  const handleChangeStatusSuccess = (data: RoomModel) => {
    toast.success("Đổi trạng thái thành công ^_^");
    onSuccessUpdateStaus(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: changeStatus,
    onSuccess: (data) => handleChangeStatusSuccess(data),
    onError: () => toast.warning("Đổi trạng thái không thành công T_T"),
  });

  useEffect(() => {
    onLoadingChange(isPending);
  }, [isPending, onLoadingChange]);

  const handleToogle = useCallback(
    (checked: boolean) => {
      // console.log(checked);
      if (data.id) {
        mutate({ id: data.id, status: checked ? 1 : 0 });
      }
    },
    [data.id, mutate],
  );
  return (
    <Switch
      checked={checked}
      onToggle={(e) => handleToogle(e)}
      isLoading={isPending}
    />
  );
};

export default StatusSwitch;
