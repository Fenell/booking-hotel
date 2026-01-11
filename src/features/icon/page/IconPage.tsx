import iconStyle from "../style/Icon.module.css";

import IconCardItem from "../components/IconCardItem";

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
      </div>
    </div>
  );
};

export default IconPage;
