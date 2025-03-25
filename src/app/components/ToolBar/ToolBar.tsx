"use client";

import React from "react";
import { usePricingContext } from "@/lib/context/PricingContext";
import { useDiscountContext } from "@/lib/context/DiscountContext";
import { IoMdAddCircleOutline } from "react-icons/io";
import SubTotal from "../SubTotal/SubTotal";
import DiscountForm from "../DiscountForm/DiscountForm";

function ToolBar() {
  const pricingTool = usePricingContext();
  const discountTool = useDiscountContext();

  const { setDiscountSelected } = discountTool;

  const { addForm, setCart } = pricingTool;

  const handleResetCart = () => {
    setCart([]);
    setDiscountSelected([]);
    localStorage.removeItem("discount");
    localStorage.removeItem("cart");
    addForm();
  };

  return (
    <div className="p-4 grid grid-cols-4">
      <button
        onClick={addForm}
        className="bg-lime-500 font-bold p-2 rounded xl:flex xl:items-center"
      >
        <IoMdAddCircleOutline />
        Add Another Pair
      </button>
      <button>Discounts</button>
      <button>Totals</button>
      <button
        className="my-4 bg-red-600 text-white font-bold p-2 rounded flex items-center justify-between"
        onClick={handleResetCart}
      >
        Reset Cart
      </button>
    </div>
  );
}

export default ToolBar;
