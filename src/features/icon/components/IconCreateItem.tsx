import classNames from "classnames";
import iconStyle from "../style/Icon.module.css";
import { useIconContext } from "../store/IconContext";

const IconCreateItem = () => {
  const { openOrCloseDialog } = useIconContext();
  return (
    <div
      className={classNames(iconStyle.iconItem, iconStyle.createCard)}
      onClick={() => openOrCloseDialog(true)}
    >
      <div className={iconStyle.createBtn}>
        <i className="fa-duotone fa-solid fa-plus fa-xl"></i>
      </div>
    </div>
  );
};

export default IconCreateItem;
