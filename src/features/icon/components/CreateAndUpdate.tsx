import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import { useIconContext } from "../store/IconContext";
import { Button } from "@shared/components/UI";
import {
  Controller,
  FormProvider,
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from "react-hook-form";
import type { IconResponse } from "../types/icon.type";
import { Input, TextArea } from "@shared/components/UI/Input";
import IconPreview from "./IconPreview";

const defaultIconValue: DefaultValues<IconResponse> = {
  id: "",
  iconCode: "",
  iconName: "",
  isActive: true,
  color: "",
  sizeIcon: "",
  description: "",
};

const CreateAndUpdate = () => {
  const { openOrCloseDialog } = useIconContext();

  const methods = useForm<IconResponse>({
    defaultValues: defaultIconValue,
  });
  const { handleSubmit, watch, control } = methods;

  // const watchFields = watch(["iconCode", "sizeIcon", "color"]);
  console.log("render");
  const onsubmit: SubmitHandler<IconResponse> = (data) => {
    console.log(JSON.stringify(data));
  };

  return (
    <Modal onClose={() => openOrCloseDialog(false)}>
      <ModalHeader>Thêm mới biểu tượng</ModalHeader>
      <ModalContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div style={{ padding: "0px 10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <label>Mã icon:</label>
                  <Controller
                    control={control}
                    name="iconCode"
                    render={({ field }) => (
                      <Input {...field} placeholder="Mã icon" />
                    )}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <label>Tên icon:</label>
                  <Controller
                    control={control}
                    name="iconName"
                    render={({ field }) => (
                      <Input {...field} placeholder="Tên icon" />
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
                  <label>Màu:</label>
                  <Controller
                    control={control}
                    name="color"
                    render={({ field }) => (
                      <Input {...field} placeholder="Mã icon" />
                    )}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <label>Kích thước:</label>
                  <Controller
                    control={control}
                    name="sizeIcon"
                    render={({ field }) => (
                      <Input {...field} placeholder="Tên icon" />
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
                <label>Mô tả:</label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => <TextArea rows={4} {...field} />}
                />
              </div>
              <div>
                <label>Xem trước</label>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <IconPreview />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </ModalContent>
      <ModalFooter>
        <Button status="primary" noAnimation>
          Cất giữ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdate;
