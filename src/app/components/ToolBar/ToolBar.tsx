"use client";

import React from "react";
import Link from "next/link";
import { usePricingContext } from "@/lib/context/PricingContext";
import { useDiscountContext } from "@/lib/context/DiscountContext";
import { IoMdAddCircleOutline } from "react-icons/io";

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
    <div className="p-2 md:px-8 md:py-4 grid grid-cols-5 bg-rv-navy">
      <button
        onClick={addForm}
        className="max-w-24 px-2 py-1 text-sm md:text-base  bg-emerald-300 hover:bg-emerald-500 font-bold rounded flex items-center justify-center"
      >
        <IoMdAddCircleOutline />
        Add
      </button>
      <Link
        href="#discount-section"
        className="max-w-24 px-2 py-1 bg-white text-xs md:text-base text-bold rounded border border-rv-navy hover:bg-sky-50 "
      >
        Discounts
      </Link>
      <Link
        href="#total-section"
        className="max-w-24 px-2 py-1 bg-white text-sm md:text-base text-bold rounded border border-rv-navy hover:bg-sky-50 "
      >
        Totals
      </Link>
      <button
        className="max-w-24 px-2 py-1 text-sm md:text-base bg-red-600 hover:bg-red-800 text-white font-bold rounded flex items-center justify-center"
        onClick={handleResetCart}
      >
        Reset
      </button>
      <button className="max-w-24 px-2 py-1 bg-white text-sm md:text-base text-bold rounded border border-rv-navy hover:bg-sky-50 ">
        Login
      </button>
    </div>
  );
}

export default ToolBar;
