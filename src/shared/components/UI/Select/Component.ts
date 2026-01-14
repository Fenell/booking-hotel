import {
  DropdownIndicatorCustom,
  DropdownMenuCustom,
  MenuListCustom,
  MultiValueCustom,
  Option,
} from "./SelectComponentCustom";

export const Components = {
  DropdownIndicator: DropdownIndicatorCustom,
  Menu: DropdownMenuCustom,
  MultiValue: MultiValueCustom,
  MenuList: MenuListCustom,
  Option: Option,
};

export const getComponent = (isMulti: boolean) => {
  const defaultComponent = {
    DropdownIndicator: DropdownIndicatorCustom,
    Menu: DropdownMenuCustom,
    MultiValue: MultiValueCustom,
    MenuList: MenuListCustom,
  };
  if (isMulti) {
    return { ...defaultComponent, Option: Option };
  }
  return defaultComponent;
};
