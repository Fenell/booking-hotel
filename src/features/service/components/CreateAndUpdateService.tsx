import { Button } from "@shared/components/UI";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import { useServiceContext } from "../store/serviceContext";
import { Input, TextArea } from "@shared/components/UI/Input";
import Popover from "@shared/components/Popover/Popover";
import IconSelect from "./IconSelect";
import { Controller, FormProvider, useWatch } from "react-hook-form";
import { useServiceForm } from "../hook/useServiceForm";
import Checkbox from "@shared/components/UI/Checkbox/Checkbox";
import { formatNumber, parseNumber } from "@shared/utils/formatNumber";
import { useState } from "react";
import { data } from "react-router";

const CreateAndUpdateService = () => {
  const { icon, id, openOrCloseDialog, selectIcon } = useServiceContext();

  const { methods, isLoading, title, onsubmit } = useServiceForm(
    id,
    selectIcon,
  );

  const { control, handleSubmit } = methods;
  const [isFee] = useWatch({
    control,
    name: ["isFee"],
  });

  const [submitAction, setSubmitAction] = useState<"save" | "saveAdd">("save");

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
            <div>
              <label htmlFor="serviceName">Tên dịch vụ:</label>
              <Controller
                name="serviceName"
                control={control}
                render={({ field }) => <Input id="serviceName" {...field} />}
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
            <div>
              <Controller
                name="isFee"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    index="isFee"
                    label="Có thu phí"
                    isChecked={value}
                    onChecked={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            </div>
            {isFee && (
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
                    render={({ field }) => <Input id="unit" {...field} />}
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
