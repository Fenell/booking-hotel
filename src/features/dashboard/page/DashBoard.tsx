import Tab from "@shared/components/Tab/Tab";
import TabContentItem from "@shared/components/Tab/TabContentItem";
import TabContent from "@shared/components/Tab/TabContent";
import TabHeader from "@shared/components/Tab/TabHeader";
import TabHeaderItem from "@shared/components/Tab/TabHeaderItem";
import { Button } from "@shared/components/UI";
import Input from "@shared/components/UI/Input/Input";
import { Modal, ModalContent, ModalHeader } from "@shared/components/UI/Modal";
import Switch from "@shared/components/UI/Switch/Switch";
import { useToast } from "@shared/hooks/useToast";
import { useState } from "react";
import { customConfirm } from "@shared/components/UI/ConfirmDialog/ConfirmDialog";
import RoomLocation from "@features/room/components/RoomLocation";

const DashBoard = () => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(true);
  const handleTest = () => {
    // toast.error("okok");
    setIsOpen(true);
  };

  const handleClose = async () => {
    console.log("ok");
    const ok = await customConfirm({
      title: "Are you absolutely sure?",
      text: "This action cannot be undone. This will permanently delete your account from our servers.",
      // options: { trueButtonText: "ok", falseButtonText: "Thôi" },
    });
    console.log(ok);
    if (ok) {
      setIsOpen(false);
    }
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
