import Tab from "@shared/components/Tab/Tab";
import TabContentItem from "@shared/components/Tab/TabContentItem";
import TabContent from "@shared/components/Tab/TabContext";
import TabHeader from "@shared/components/Tab/TabHeader";
import TabHeaderItem from "@shared/components/Tab/TabHeaderItem";
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

      <Tab onChangeTab={(e) => console.log(e)}>
        <TabHeader>
          <TabHeaderItem title="1234" idTab="1" selectDefault />
          <TabHeaderItem title="vssdffg4" idTab="3" />
        </TabHeader>
        <TabContent>
          <TabContentItem idTab="1">sdjfksjdfksdjf</TabContentItem>
          <TabContentItem idTab="3">s12312312312321</TabContentItem>
        </TabContent>
      </Tab>
    </div>
  );
};

export default DashBoard;
