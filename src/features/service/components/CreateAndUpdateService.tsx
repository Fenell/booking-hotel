import { Button } from "@shared/components/UI";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import { useServiceContext } from "../context/ServiceContext";
import { Input, TextArea } from "@shared/components/UI/Input";
import Popover from "@shared/components/Popover/Popover";
import IconSelect from "./IconSelect";
import { Controller, FormProvider, useWatch } from "react-hook-form";
import { useServiceForm } from "../hook/useServiceForm";
import Checkbox from "@shared/components/UI/Checkbox/Checkbox";
import { formatNumber, parseNumber } from "@shared/utils/formatNumber";
import { useState } from "react";
import SelectCustom from "@shared/components/UI/Select/SelectCustom";
import { useQuery } from "@tanstack/react-query";
import { getDynamicData } from "@shared/services/dynamic";
import {
  SERVICE_KIND,
  SERVICE_KIND_LABEL,
  type ServiceType,
} from "../types/service.type";
import type { DynamicDataPagingRequest } from "@shared/types/dynamic";

const CreateAndUpdateService = () => {
  const { icon, id, openOrCloseDialog, selectIcon } = useServiceContext();

  const { methods, isLoading, title, onsubmit } = useServiceForm(
    id,
    selectIcon,
  );

  const { control, handleSubmit, setValue } = methods;
  const [kind] = useWatch({
    control,
    name: ["kind"],
  });
  // Tiện nghi không có giá; hàng hóa và dịch vụ thì bắt buộc có (DB ép bằng CHECK)
  const isSellable = kind !== SERVICE_KIND.amenity;

  const [submitAction, setSubmitAction] = useState<"save" | "saveAdd">("save");

  const serviceTypeRq: DynamicDataPagingRequest = {
    tableNames: "type_services",
    pageNumber: 1,
    pageSize: 100,
  };

  const { data } = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => getDynamicData<ServiceType[]>(serviceTypeRq),
  });

  // Nhóm phải cùng kind với dịch vụ — DB chặn bằng composite FK, nên lọc sẵn ở đây
  // để người dùng không chọn được nhóm sai (hàng hóa mà chọn nhóm "Spa").
  const optionTypeService = data?.data
    .filter((a) => a.kind === kind)
    .map((a) => ({
      label: a.nameTypeService,
      value: a.id,
    }));

  const optionKind = Object.entries(SERVICE_KIND_LABEL).map(
    ([value, label]) => ({ label, value: Number(value) }),
  );

  return (
    <Modal size="xs" onClose={() => openOrCloseDialog(false)}>
      <ModalHeader hasCloseButton title={title} />
      <ModalContent>
        <FormProvider {...methods}>
          <form
            id="service-form"
            autoComplete="off"
            style={{ padding: "10px" }}
            onSubmit={handleSubmit(onsubmit)}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "50%" }}>
                <label htmlFor="serviceCode">Mã dịch vụ:</label>
                <Controller
                  name="serviceCode"
                  control={control}
                  render={({ field }) => <Input id="serviceCode" {...field} />}
                />
              </div>
              <div style={{ width: "50%" }}>
                <label htmlFor="serviceName">Tên dịch vụ:</label>
                <Controller
                  name="serviceName"
                  control={control}
                  render={({ field }) => <Input id="serviceName" {...field} />}
                />
              </div>
            </div>
            <div>
              <label htmlFor="kind">Loại:</label>
              <Controller
                control={control}
                name="kind"
                render={({ field }) => (
                  <SelectCustom
                    {...field}
                    inputId="kind"
                    options={optionKind}
                    value={optionKind.find((c) => c.value === field.value)}
                    onChange={(e) => {
                      field.onChange(e?.value);
                      // Nhóm cũ thuộc loại khác thì không còn hợp lệ
                      setValue("idTypeService", "");
                      if (e?.value === SERVICE_KIND.amenity) {
                        // Tiện nghi: DB bắt buộc price/unit null và không mang cờ bán
                        setValue("price", null);
                        setValue("unit", null);
                        setValue("isBookable", false);
                        setValue("isOrderable", false);
                      }
                    }}
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="idTypeService">Nhóm:</label>
              <Controller
                control={control}
                name="idTypeService"
                render={({ field }) => (
                  <SelectCustom
                    {...field}
                    inputId="idTypeService"
                    options={optionTypeService}
                    value={optionTypeService?.find(
                      (c) => c.value === field.value,
                    )}
                    onChange={(e) => field.onChange(e?.value)}
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="description">Mô tả:</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea id="description" rows={4} {...field} />
                )}
              />
            </div>
            <div>
              <Popover status="info" noAnimation content={<IconSelect />}>
                Biểu tượng
              </Popover>
              <div style={{ display: "inline", marginLeft: "10px" }}>
                <i
                  className={`fa-regular fa-${icon?.iconCode} ${icon?.sizeIcon && "fa-" + icon?.sizeIcon}`}
                  style={{
                    color: icon?.color ?? "#2796fd",
                  }}
                ></i>
              </div>
            </div>
            {isSellable && (
              <div style={{ display: "flex", gap: "14px" }}>
                <Controller
                  name="isBookable"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      index="isBookable"
                      label="Chọn được khi đặt phòng"
                      isChecked={value}
                      onChecked={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
                <Controller
                  name="isOrderable"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      index="isOrderable"
                      label="Gọi thêm khi đang ở"
                      isChecked={value}
                      onChecked={(e) => onChange(e.target.checked)}
                    />
                  )}
                />
              </div>
            )}
            {isSellable && (
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "50%" }}>
                  <label htmlFor="price">Giá dịch vụ:</label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="price"
                        {...field}
                        value={formatNumber(field.value)}
                        onChange={(e) =>
                          field.onChange(parseNumber(e.target.value))
                        }
                      />
                    )}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <label htmlFor="unit">Đơn vị</label>
                  <Controller
                    name="unit"
                    control={control}
                    render={({ field }) => (
                      <Input id="unit" {...field} value={field.value ?? ""} />
                    )}
                  />
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </ModalContent>
      <ModalFooter>
        <Button
          form="service-form"
          status="success"
          noAnimation
          type="submit"
          isLoading={isLoading}
          onClick={() => setSubmitAction("save")}
        >
          Cất giữ
        </Button>
        <Button
          form="service-form"
          status="success"
          noAnimation
          type="submit"
          isLoading={isLoading}
          onClick={() => setSubmitAction("saveAdd")}
        >
          Cất & Thêm mới
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdateService;
