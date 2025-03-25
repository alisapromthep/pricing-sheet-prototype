import React from "react";
import { RiDeleteBack2Line } from "react-icons/ri";

interface SelectedButtonPropsType {
  name: string;
  handleDelete: () => {};
}

const SelectedButton: React.FC<SelectedButtonPropsType> = ({
  name,
  handleDelete,
}) => {
  return (
    <button onClick={handleDelete}>
      name
      <RiDeleteBack2Line />
    </button>
  );
};

export default SelectedButton;
