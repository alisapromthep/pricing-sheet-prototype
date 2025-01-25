"use client";

import { useState, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Form from "../Form/Form";
import SubTotal from "../SubTotal/SubTotal";
import { usePricingContext } from "@/lib/context/PricingContext";
import { useAllProductsContext } from "@/lib/context/AllProductsContext";

export default function PricingSheet() {
  const pricingTool = usePricingContext();
  const allProducts = useAllProductsContext();

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
