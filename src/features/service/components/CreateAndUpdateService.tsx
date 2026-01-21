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
import { Controller, FormProvider } from "react-hook-form";
import { useServiceForm } from "../hook/useServiceForm";

const CreateAndUpdateService = () => {
  const { icon, id, openOrCloseDialog, selectIcon } = useServiceContext();

  const { methods, isLoading, title, onsubmit } = useServiceForm(
    id,
    selectIcon,
  );

  const { control, handleSubmit, reset } = methods;

  return (
    <Modal onClose={() => openOrCloseDialog(false)}>
      <ModalHeader hasCloseButton title={title} />
      <ModalContent>
        <FormProvider {...methods}>
          <form
            id="service-form"
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
        >
          Cất giữ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdateService;
