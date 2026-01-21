import {
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from "react-hook-form";
import type { ServiceResponse } from "../types/service.type";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createService, updateService } from "../api/service.api";
import { useToast } from "@shared/hooks/useToast";
import { queryClient } from "@app/queryClient";
import { getDynamicData } from "@shared/services/dynamic";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import type { IconResponse } from "@features/icon/types/icon.type";

const defaultValues: DefaultValues<ServiceResponse> = {
  id: "",
  serviceCode: "",
  serviceName: "",
  description: "",
  idIcon: "",
};

export const useServiceForm = (
  id: string | undefined,
  selectIcon: (icon?: IconResponse | null) => void,
) => {
  const toast = useToast();
  const isEdit = Boolean(id);
  const methods = useForm<ServiceResponse>({
    defaultValues,
  });
  const { reset } = methods;

  const handleCreateSuccess = () => {
    if (isEdit) {
      toast.success("Cập nhật dịch vụ thành công ^_^");
    } else {
      toast.success("Tạo mới dịch vụ thành công ^_^");
      reset(defaultValues);
      selectIcon(null);
    }
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const mutaion = useMutation({
    mutationFn: createService,
    onSuccess: handleCreateSuccess,
    onError: () => {
      toast.warning("Tạo mới dịch vụ thất bại T_T");
    },
  });

  const mutaionUpdate = useMutation({
    mutationFn: updateService,
    onSuccess: handleCreateSuccess,
    onError: () => {
      toast.warning("Cập nhật dịch vụ thất bại T_T");
    },
  });

  const getServiceRequest: DyanmicDataPagingRequest = {
    tableNames: "view_service_with_icon",
    filters: [{ field: "id", operator: "=", value: id ?? "" }],
    pageSize: 10,
    pageNumber: 1,
  };

  const { data, isSuccess } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getDynamicData<ServiceResponse[]>(getServiceRequest),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && isSuccess && data) {
      const detail = data.data[0];
      reset(detail);
      const iconView: IconResponse = {
        iconCode: detail.iconCode ?? "",
        sizeIcon: detail.sizeIcon,
        color: detail.color,
      };
      selectIcon(iconView);
    }
  }, [data, isEdit, isSuccess, reset]);

  const onsubmit: SubmitHandler<ServiceResponse> = ({
    id,
    createDate,
    isActive,
    ...other
  }) => {
    if (isEdit) {
      mutaionUpdate.mutate({ id, ...other });
    } else mutaion.mutate(other);
  };

  useEffect(() => {
    return () => {
      selectIcon(null);
    };
  }, []);

  const isLoading: boolean = mutaion.isPending;
  const title: string = isEdit ? `Sửa` : "Thêm mới";

  return { methods, isLoading, title, onsubmit };
};
