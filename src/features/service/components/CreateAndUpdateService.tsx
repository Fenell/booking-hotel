import { Button } from "@shared/components/UI";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import { useServiceContext } from "../store/serviceContext";

const CreateAndUpdateService = () => {
  const { openOrCloseDialog } = useServiceContext();
  return (
    <Modal onClose={() => openOrCloseDialog(false)}>
      <ModalHeader hasCloseButton title="Thêm mới" />
      <ModalContent>sfksdfksdfkd</ModalContent>
      <ModalFooter>
        <Button status="success" noAnimation>
          Cất giữ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdateService;
