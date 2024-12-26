"use client";

import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Form from "../Form/Form";

export default function PricingSheet() {
  const [formsArray, setFormsArray] = useState<Array<Record<string, any>>>([
    {},
  ]);

  const addForm = () => {
    setFormsArray((prev) => [...prev, {}]);
  };

  return (
    <div>
      <button
        onClick={addForm}
        className="bg-lime-500 font-bold p-2 rounded flex items-center justify-between"
      >
        <IoMdAddCircleOutline />
        Add Another Pair
      </button>
      {formsArray.map((_, index) => (
        <Form key={index} index={index} />
      ))}
    </div>
  );
}
