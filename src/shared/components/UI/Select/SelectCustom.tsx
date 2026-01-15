import "./SelectCustom.css";
import Select, { type GroupBase, type Props } from "react-select";
import { AnimatePresence } from "motion/react";
import { getComponent } from "./Component";

type SelectCustomProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group> & {
  placeholder?: string;
  multiSelect?: IsMulti;
  small?: boolean;
};

const SelectCustom = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  placeholder = "Chọn",
  multiSelect = false as IsMulti,
  small = false,
  ...props
}: SelectCustomProps<Option, IsMulti, Group>) => {
  //Prop "value" truyền vào từ field trong Controller của React form

  const components = getComponent(multiSelect);
  return (
    <AnimatePresence>
      <Select<Option, IsMulti, Group>
        {...props}
        unstyled
        styles={{ container: (base) => ({ ...base, width: "150px" }) }}
        placeholder={placeholder}
        components={components}
        isMulti={multiSelect}
        closeMenuOnSelect={!multiSelect}
        hideSelectedOptions={false}
        className="select-custom-container"
        classNamePrefix={`${small ? "select-custom-small" : "select-custom"}`}
        noOptionsMessage={({ inputValue }) => {
          return inputValue && "Không có kết quả";
        }}
        // value={data.find((opt) => opt.value === value)}
      />
    </AnimatePresence>
  );
};

export default SelectCustom;
