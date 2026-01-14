import "./SelectCustom.css";
import Select, {
  type GroupBase,
  type OptionsOrGroups,
  type Props,
} from "react-select";
import { AnimatePresence } from "motion/react";
import { getComponent } from "./Component";

interface SelectCustomProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> extends Props<Option, IsMulti, Group> {
  placeholder: string;
  multiSelect?: boolean;
  small?: boolean;
  data: OptionsOrGroups<Option, Group>;
}

const SelectCustom = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  placeholder = "Chọn",
  multiSelect = false,
  small = false,
  data,
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
        options={data}
        isMulti={multiSelect as IsMulti}
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
