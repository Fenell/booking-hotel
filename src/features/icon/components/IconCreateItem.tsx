import classNames from "classnames";
import iconStyle from "../style/Icon.module.css";

const IconCreateItem = () => {
  return (
    <div className={classNames(iconStyle.iconItem, iconStyle.createCard)}>
      <div className={iconStyle.createBtn}>
        <i className="fa-duotone fa-solid fa-plus fa-xl"></i>
      </div>
    </div>
  );
};

export default IconCreateItem;
