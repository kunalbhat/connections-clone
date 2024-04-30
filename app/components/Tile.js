import { useEffect, useState } from "react";

const Tile = ({
  data,
  deselect,
  selectedCount,
  setDeselected,
  selectedItems,
  setSelectedItems,
}) => {
  const [selected, setSelected] = useState(false);

  function toggleSelected() {
    // Select and add to the selected items array
    if (selectedCount < 4 && selected === false) {
      setSelected(true);
      setSelectedItems([...selectedItems, data]);
    }

    // Deselect and remove from the selected items array
    if (selected === true) {
      setSelected(false);
      setSelectedItems((selectedItems) => {
        return selectedItems.filter((item) => item !== data);
      });
    }
  }

  useEffect(() => {
    setSelected(false);
    setDeselected(false);
  }, [deselect, setDeselected]);

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
