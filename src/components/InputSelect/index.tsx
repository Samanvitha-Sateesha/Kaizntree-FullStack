import Downshift from "downshift"
import { useCallback, useState, useEffect, useRef } from "react"
import debounce from 'lodash/debounce';
import classNames from "classnames"
import { DropdownPosition, GetDropdownPositionFn, InputSelectOnChange, InputSelectProps } from "./types"

export function InputSelect<TItem>({
  label,
  defaultValue,
  onChange: consumerOnChange,
  items,
  parseItem,
  isLoading,
  loadingLabel,
}: InputSelectProps<TItem>) {
  const [selectedValue, setSelectedValue] = useState<TItem | null>(defaultValue ?? null)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  })
  const inputRef = useRef(null)

  const onChange = useCallback<InputSelectOnChange<TItem>>(
    (selectedItem) => {
      if (selectedItem === null) {
        return
      }

      consumerOnChange(selectedItem)
      setSelectedValue(selectedItem)
    },
    [consumerOnChange]
  )
  // useEffect(() => {
  //   const handleScroll = debounce(() => {
  //     if (inputRef.current) {
  //       setDropdownPosition(getDropdownPosition(inputRef.current));
  //     }
  //   }, 100);

    
  //   // Attach the event listener
  //   window.addEventListener('scroll', handleScroll);

  //   // Cleanup function to remove the event listener
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []) 
  useEffect(() => {
    // Function to update position
    const updatePosition = () => {
      if (inputRef.current) {
        setDropdownPosition(getDropdownPosition(inputRef.current));
      }
    };
  
    // Update immediately and then on scroll
    updatePosition();
    const handleScroll = debounce(updatePosition, 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])
  return (
    <Downshift<TItem>
      id="KaizntreeSelect"
      onChange={onChange}
      selectedItem={selectedValue}
      itemToString={(item) => (item ? parseItem(item).label : "")}
    >
      {({
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        getToggleButtonProps,
        inputValue,
      }) => {
        const toggleProps = getToggleButtonProps()
        const parsedSelectedItem = selectedItem === null ? null : parseItem(selectedItem)
        return (
          <div className="KaizntreeInputSelect--root">
            <label className="KaizntreeText--s KaizntreeText--hushed" {...getLabelProps()}>
              {label}
            </label>
            <div className="KaizntreeBreak--xs" />
            <div
              // ref={inputRef}
              className="KaizntreeInputSelect--input"
              onClick={(event) => {
                if (inputRef.current) {
                  setDropdownPosition(getDropdownPosition(inputRef.current));
                }
                toggleProps.onClick(event);
              }}
            >
              {inputValue}
            </div>

            <div
              className={classNames("KaizntreeInputSelect--dropdown-container", {
                "KaizntreeInputSelect--dropdown-container-opened": isOpen,
              })}
              {...getMenuProps()}
              style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
              {renderItems()}
            </div>
          </div>
        )

        function renderItems() {
          if (!isOpen) {
            return null
          }

          if (isLoading) {
            return <div className="KaizntreeInputSelect--dropdown-item">{loadingLabel}...</div>
          }

          if (items.length === 0) {
            return <div className="KaizntreeInputSelect--dropdown-item">No items</div>
          }

          return items.map((item, index) => {
            const parsedItem = parseItem(item)
            return (
              <div
                key={parsedItem.value}
                {...getItemProps({
                  key: parsedItem.value,
                  index,
                  item,
                  className: classNames("KaizntreeInputSelect--dropdown-item", {
                    "KaizntreeInputSelect--dropdown-item-highlighted": highlightedIndex === index,
                    "KaizntreeInputSelect--dropdown-item-selected":
                      parsedSelectedItem?.value === parsedItem.value,
                  }),
                })}
              >
                {parsedItem.label}
              </div>
            )
          })
        }
      }}
    </Downshift>
  )
}

const getDropdownPosition: GetDropdownPositionFn = (target) => {
  if (target instanceof Element) {
    const rect = target.getBoundingClientRect();
    // const { top, left } = target.getBoundingClientRect()
    // const { scrollY } = window
    // return {
    //   top: scrollY + top + 63,
    //   left,
    // }
    const topPosition = rect.top + rect.height + window.scrollY;
    const leftPosition = rect.left + window.scrollX; // Left position remains the same

    return {
      top: topPosition,
      left: leftPosition,
    };
  }

  return { top: 0, left: 0 }
}
