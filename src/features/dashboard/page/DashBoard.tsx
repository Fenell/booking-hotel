import { Button } from "@shared/components/UI";
import Input from "@shared/components/UI/Input/Input";
import { Modal, ModalContent, ModalHeader } from "@shared/components/UI/Modal";
import Switch from "@shared/components/UI/Switch/Switch";
import { useToast } from "@shared/hooks/useToast";
import { useState } from "react";

const DashBoard = () => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(true);
  const handleTest = () => {
    // toast.error("okok");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      {isOpen && (
        <Modal onClose={handleClose}>
          <ModalHeader hasCloseButton>Kaka</ModalHeader>
          <ModalContent>okeok</ModalContent>
        </Modal>
      )}
      <Button
        status="error"
        icon="fa-duotone fa-regular fa-trash"
        showTooltip
        tooltipContent="tesst"
        small
        onClick={handleTest}
      >
        Test
      </Button>

      <Input placeholder="okeoej" />
      <Switch checked={status} onToggle={(e) => setStatus(e)} />
    </div>
  );
};

export default DashBoard;
