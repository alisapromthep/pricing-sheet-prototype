"use client";

import { useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Form from "../Form/Form";
import SubTotal from "../SubTotal/SubTotal";
import { usePricingContext } from "@/lib/context/PricingContext";

export default function PricingSheet() {
  const pricingTool = usePricingContext();

  const { createProduct, formsArray, setFormsArray } = pricingTool;

  const addForm = () => {
    const newForm = createProduct();
    setFormsArray((prev) => [...prev, newForm]);
  };

  useEffect(() => {
    addForm();
  }, []);

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
        {formsArray.map((form, index) => {
          return <Form key={form.id} index={index} formID={form.id} />;
        })}
      </div>
      <SubTotal />
    </div>
  );
}
