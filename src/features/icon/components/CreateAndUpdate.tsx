import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import { useIconContext } from "../store/IconContext";
import { Button } from "@shared/components/UI";
import { Controller, FormProvider } from "react-hook-form";
import { Input, TextArea } from "@shared/components/UI/Input";
import IconPreview from "./IconPreview";
import SelectCustom from "@shared/components/UI/Select/SelectCustom";

import { useIconForm } from "../hook/useIconForm";

type IconOption = {
  value: string;
  label: string;
};

const iconSizeOption: IconOption[] = [
  { label: "2xs", value: "2xs" },
  { label: "xs", value: "xs" },
  { label: "sm", value: "sm" },
  { label: "lg", value: "lg" },
  { label: "xl", value: "xl" },
  { label: "none", value: "" },
];

const CreateAndUpdate = () => {
  const { openOrCloseDialog, id } = useIconContext();
  const [color, methods, isEdit, title, isLoading, onsubmit] = useIconForm(id);
  const { handleSubmit, control, setValue } = methods;

  return (
    <Modal onClose={() => openOrCloseDialog(false)}>
      <ModalHeader>{title}</ModalHeader>
      <ModalContent>
        <FormProvider {...methods}>
          <form id="icon-form" onSubmit={handleSubmit(onsubmit)}>
            <div style={{ padding: "5px 10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <label htmlFor="iconCode">Mã icon:</label>
                  <Controller
                    control={control}
                    name="iconCode"
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Mã icon"
                        id="iconCode"
                        name={field.name}
                      />
                    )}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <label htmlFor="iconName">Tên icon:</label>
                  <Controller
                    control={control}
                    name="iconName"
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Tên icon"
                        id="iconName"
                        name="iconName"
                      />
                    )}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <label htmlFor="color">Màu:</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setValue("color", e.target.value)}
                      id="color"
                      name="color"
                      style={{
                        border: "none",
                        cursor: "pointer",
                        width: "30px",
                      }}
                    />
                    <Input
                      placeholder="màu"
                      value={color}
                      id="color"
                      name="color"
                      onChange={(e) => setValue("color", e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <label htmlFor="sizeIcon">Kích thước:</label>
                  <Controller
                    control={control}
                    name="sizeIcon"
                    render={({ field }) => (
                      <SelectCustom<IconOption>
                        {...field}
                        options={iconSizeOption}
                        value={iconSizeOption.find(
                          (c) => c.value === field.value,
                        )}
                        onChange={(a) => field.onChange(a?.value)}
                        name="sizeIcon"
                        inputId="sizeIcon"
                      />
                    )}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "10px",
                }}
              >
                <label htmlFor="description">Mô tả:</label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <TextArea
                      rows={4}
                      {...field}
                      id="description"
                      name="description"
                    />
                  )}
                />
              </div>
              <div>
                <span>Xem trước</span>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <IconPreview />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </ModalContent>
      <ModalFooter>
        <Button
          status="primary"
          noAnimation
          type="submit"
          form="icon-form"
          isLoading={isLoading}
        >
          Cất giữ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdate;
