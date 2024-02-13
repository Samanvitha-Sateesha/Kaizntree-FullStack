import classNames from "classnames"
import { useState,useRef } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`KaizntreeInputCheckbox-${id}`)

  return (
    <div className="KaizntreeInputCheckbox--container" data-testid={inputId}>
      <label
        htmlFor={inputId}
        className={classNames("KaizntreeInputCheckbox--label", {
          "KaizntreeInputCheckbox--label-checked": checked,
          "KaizntreeInputCheckbox--label-disabled": disabled,
        })}
      />
      <input
        id={inputId}
        type="checkbox"
        className="KaizntreeInputCheckbox--input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  )
}
const ParentComponent = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (newCheckedValue: boolean) => {
    setIsChecked(newCheckedValue);
  }

  return (
    <InputCheckbox
      id="uniqueId" // Provide a unique ID for each checkbox
      checked={isChecked}
      onChange={handleCheckboxChange}
      // Include other props as necessary
    />
  )
}

