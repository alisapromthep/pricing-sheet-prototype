"use client";

import { useState, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Form from "../Form/Form";
import SubTotal from "../SubTotal/SubTotal";
import { usePricingContext } from "@/lib/context/PricingContext";
import { useAllProductsContext } from "@/lib/context/AllProductsContext";

export default function PricingSheet() {
  //const [formsArray, setFormsArray] = useState<Array<Record<string, any>>>([]);

  const pricingTool = usePricingContext();
  const allProducts = useAllProductsContext();
  console.log(pricingTool);
  console.log("allProducts", allProducts);

  const { createProduct } = pricingTool;
  const { formsArray, setFormsArray } = allProducts;

  const addForm = () => {
    const newForm = createProduct();
    setFormsArray((prev) => [...prev, newForm]);
  };

  useEffect(() => {
    addForm();
  }, []);

  //TODO: currently deleting everything except 1

  const deleteForm = (agru) => {
    console.log("deleteForm");
  };
  console.log("formsArray", formsArray);

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
