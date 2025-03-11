"use client";

import React from "react";
import { usePricingContext } from "@/lib/context/PricingContext";
import { IoMdAddCircleOutline } from "react-icons/io";
import SubTotal from "../SubTotal/SubTotal";
import DiscountForm from "../DiscountForm/DiscountForm";

function ToolBar() {
  const pricingTool = usePricingContext();

  const { addForm, setCart } = pricingTool;

  const handleResetCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    addForm();
  };

  return (
    <div className="justify-between p-4 flex flex-row xl:flex-col">
      <button
        onClick={addForm}
        className="hidden bg-lime-500 font-bold p-2 rounded xl:flex xl:items-center"
      >
        <IoMdAddCircleOutline />
        Add Another Pair
      </button>
      <div>
        <p>Discounts</p>
        <DiscountForm />
      </div>
      <SubTotal />
      <div className="flex">
        <button
          className="self-end my-4 bg-red-600 text-white font-bold p-2 rounded flex items-center justify-between"
          onClick={handleResetCart}
        >
          Reset Cart
        </button>
      </div>
    </div>
  );
}

export default ToolBar;
