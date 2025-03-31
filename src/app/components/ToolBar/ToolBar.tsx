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
    <div className="p-2 grid grid-cols-5">
      <button
        onClick={addForm}
        className="max-w-24 px-2 py-1 text-sm  bg-emerald-300 hover:bg-emerald-500 font-bold rounded flex items-center justify-center"
      >
        <IoMdAddCircleOutline />
        Add
      </button>
      <button className="max-w-24 px-2 py-1 text-sm rounded border border-rv-navy hover:bg-sky-50 ">
        Discounts
      </button>
      <button className="max-w-24 px-2 py-1 text-sm rounded border border-rv-navy hover:bg-sky-50 ">
        Totals
      </button>
      <button
        className="max-w-24 px-2 py-1 text-sm bg-red-600 hover:bg-red-800 text-white font-bold rounded flex items-center justify-center"
        onClick={handleResetCart}
      >
        Reset
      </button>
      <button className="max-w-24 px-2 py-1 text-sm rounded border border-rv-navy hover:bg-sky-50 ">
        Login
      </button>
    </div>
  );
}

export default ToolBar;
