import iconStyle from "../style/Icon.module.css";

import IconCardItem from "../components/IconCardItem";
import IconCreateItem from "../components/IconCreateItem";

const IconPage = () => {
  return (
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
  );
};

export default IconPage;
