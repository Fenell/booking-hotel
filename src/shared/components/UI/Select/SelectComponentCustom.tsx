import {
  components,
  type DropdownIndicatorProps,
  type GroupBase,
  type MenuListProps,
  type MenuProps,
  type MultiValueProps,
  type OptionProps,
} from "react-select";
import { AnimatePresence, motion } from "motion/react";

export const DropdownIndicatorCustom = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>
) => {
  const menuIsOpen = props.selectProps;
  return (
    <components.DropdownIndicator {...props}>
      <motion.i
        animate={{ rotate: menuIsOpen ? 180 : 0 }}
        className="fa-solid fa-chevron-down fa-sm"
      ></motion.i>
    </components.DropdownIndicator>
  );
};

export const DropdownMenuCustom = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: MenuProps<Option, IsMulti, Group>
) => {
  // console.log(props);

  // handleMenuOpen = props.selectProps.onMenuOpen()  ;
  return (
    <AnimatePresence>
      {props.selectProps.menuIsOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: "relative", zIndex: 100 }}
        >
          <components.Menu {...props}>{props.children}</components.Menu>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MultiValueCustom = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: MultiValueProps<Option, IsMulti, Group>
) => {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <components.MultiValue {...props}>{props.children}</components.MultiValue>
    </motion.div>
  );
};

export const MenuListCustom = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: MenuListProps<Option, IsMulti, Group>
) => {
  return (
    <components.MenuList {...props}>
      {/* <div className="select-custom__action">
        <button>fsjdkfsjdk</button>
      </div> */}
      {props.children}
    </components.MenuList>
  );
};

export const Option = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: OptionProps<Option, IsMulti, Group>
) => {
  return (
    <div>
      <components.Option {...props}>
        {/* <Checkbox isChecked={props.isSelected} onChange={() => null} />{" "}
        <label>{props.label}</label> */}
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};
