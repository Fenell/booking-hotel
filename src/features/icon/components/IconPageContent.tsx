import IconCardItem from "./IconCardItem";
import IconCreateItem from "./IconCreateItem";
import iconStyle from "../style/Icon.module.css";
import { useIconContext } from "../store/IconContext";
import CreateAndUpdate from "./CreateAndUpdate";

const IconPageContent = () => {
  const { isOpen } = useIconContext();
  console.log(isOpen);
  return (
    <>
      {isOpen && <CreateAndUpdate />}
      <div style={{ width: "100%" }}>
        <div className={iconStyle.iconBox}>
          <IconCardItem />
          <IconCardItem />
          <IconCardItem />
          <IconCardItem />
          <IconCardItem />
          <IconCardItem />
          <IconCreateItem />
        </div>
      </div>
    </>
  );
};

export default IconPageContent;
