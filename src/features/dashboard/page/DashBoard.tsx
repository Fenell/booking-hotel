import { Button } from "@shared/components/UI";
import { useToast } from "@shared/hooks/useToast";

const DashBoard = () => {
  const toast = useToast();
  const handleTest = () => {
    toast.error("okok");
  };
  return (
    <div>
      sesrseres
      <Button
        status="error"
        icon="fa-duotone fa-regular fa-trash"
        showTooltip
        tooltipContent="tesst"
        onClick={handleTest}
      >
        Test
      </Button>
    </div>
  );
};

export default DashBoard;
