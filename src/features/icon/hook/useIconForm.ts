import {
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from "react-hook-form";
import type { IconResponse } from "../types/icon.type";
import { useToast } from "@shared/hooks/useToast";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createIcon, updateIcon } from "../api/icon.api";
import { useEffect } from "react";
import { getDynamicData } from "@shared/services/dynamic";
import { queryClient } from "@app/queryClient";

const defaultIconValue: DefaultValues<IconResponse> = {
  iconCode: "",
  iconName: "",
  isActive: true,
  color: "#21a9e4",
  sizeIcon: "",
  description: "",
};

export const useIconForm: any = (id?: string) => {
  const toast = useToast();
  const methods = useForm<IconResponse>({
    defaultValues: defaultIconValue,
  });
  const { watch, reset } = methods;
  const color = watch("color");
  const isEdit = Boolean(id);

  const getIconRequest: DyanmicDataPagingRequest = {
    tableNames: "icons",
    filters: [{ field: "id", operator: "=", value: id ?? "" }],
    pageSize: 10,
    pageNumber: 1,
  };

  const { data, isSuccess } = useQuery({
    queryKey: ["icons", id],
    queryFn: () => getDynamicData<IconResponse[]>(getIconRequest),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && data && isSuccess) {
      reset(data.data[0]);
    }
  }, [data, isEdit, isSuccess, reset]);

  const handleSuccess = () => {
    if (isEdit) {
      toast.success("Cập nhật thành công ^_^");
    } else {
      toast.success("Tạo mới thành công ^_^");
      reset(defaultIconValue);
    }
    queryClient.invalidateQueries({ queryKey: ["icons"] });
  };

  const mutation = useMutation({
    mutationFn: createIcon,
    onSuccess: handleSuccess,
    onError: () => toast.warning("Tạo mới thất bại T_T"),
  });

  const mutationUpdate = useMutation({
    mutationFn: updateIcon,
    onSuccess: handleSuccess,
    onError: () => toast.warning("Cập nhật thất bại T_T"),
  });

  const title: string = !isEdit
    ? "Thêm mới biểu tượng"
    : isSuccess
      ? `Sửa biểu tượng: ${data?.data[0].iconName}`
      : "";

  const onsubmit: SubmitHandler<IconResponse> = (data) => {
    const { id, createdDate, isActive, ...rest } = data;

    if (isEdit) {
      mutationUpdate.mutate({ id, data });
    } else {
      mutation.mutate(rest);
    }
  };
  const isLoading = mutation.isPending || mutationUpdate.isPending;
  return [color, methods, isEdit, title, isLoading, onsubmit];
};
