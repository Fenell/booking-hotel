import IconPageContent from "../components/IconPageContent";
import { IconContextProvider } from "../store/IconContext";

const IconPage = () => {
  return (
    <>
      <IconContextProvider>
        <IconPageContent />
      </IconContextProvider>
    </>
  );
};

export default IconPage;
