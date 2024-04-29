import { useEffect, useState } from "react";

const Tile = ({
  data,
  selectedCount,
  setSelectedCount,
  selectedItems,
  setSelectedItems,
}) => {
  const [selected, setSelected] = useState(false);

  function toggleSelected() {
    // Select and add to the selected items array
    if (selectedCount < 4 && selected === false) {
      setSelected(true);
      setSelectedCount(selectedCount + 1);
      setSelectedItems([...selectedItems, data]);
    }

    // Deselect and remove from the selected items array
    if (selected === true) {
      setSelected(false);
      setSelectedCount(selectedCount - 1);
      setSelectedItems((selectedItems) => {
        return selectedItems.filter((item) => item !== data);
      });
    }
  }

  return (
    <li
      className={`tile cursor-pointer ${selected ? "selected" : ""}`}
      onClick={toggleSelected}
    >
      {data}
    </li>
  );
};

export { Tile };
