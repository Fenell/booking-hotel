import iconStyle from "../style/Icon.module.css";

const IconCreateItem = () => {
  return (
    <div className={iconStyle.iconItem}>
      <div className={iconStyle.createBtn}>
        <i className="fa-duotone fa-solid fa-plus fa-xl"></i>
      </div>
    </div>
  );
};

export default IconCreateItem;
