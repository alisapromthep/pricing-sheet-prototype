"use client";

import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Form from "../Form/Form";
import SubTotal from "../SubTotal/SubTotal";
export default function PricingSheet() {
  const [formsArray, setFormsArray] = useState<Array<Record<string, any>>>([
    {},
  ]);

  const addForm = () => {
    setFormsArray((prev) => [...prev, {}]);
  };

  //TODO: currently deleting everything except 1

  const deleteForm = (index) => {
    formsArray.splice(index, 1);
    setFormsArray((prev) => prev.splice(index, 1));
  };
  console.log(formsArray);

  return (
    <div>
      <button
        onClick={addForm}
        className="bg-lime-500 font-bold p-2 rounded flex items-center justify-between"
      >
        <IoMdAddCircleOutline />
        Add Another Pair
      </button>
      <div className="flex flex-wrap">
        {formsArray.map((_, index) => (
          <Form key={index} index={index} handleDelete={deleteForm} />
        ))}
      </div>
      <SubTotal />
    </div>
  );
}
