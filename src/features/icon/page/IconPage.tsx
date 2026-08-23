import IconListView from "./IconListView";
import { IconContextProvider } from "../context/IconContext";

const IconPage = () => {
  return (
    <IconContextProvider>
      <title>Quản lý biểu tượng</title>
      <IconListView />
    </IconContextProvider>
  );
};

export default IconPage;
