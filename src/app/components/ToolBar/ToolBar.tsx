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
      <div>
        <p>Discounts</p>
        <DiscountForm />
      </div>
      <SubTotal />
      <button onClick={handleResetCart}>Reset Cart</button>
    </div>
  );
}

export default ToolBar;
