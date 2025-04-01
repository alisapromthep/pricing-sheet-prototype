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
    <div className="sticky top-0 py-2 md:px-8 md:py-4 grid grid-cols-5 bg-rv-navy gap-1">
      <button
        onClick={addForm}
        className="max-w-24 p-1 text-white text-sm md:text-base font-bold rounded flex items-center justify-center"
      >
        <IoMdAddCircleOutline />
        Add
      </button>
      <Link
        href="#discount-section"
        className="max-w-24 p-1 text-white  text-sm md:text-base text-bold rounded border border-rv-navy "
      >
        Discounts
      </Link>
      <Link
        href="#total-section"
        className="max-w-24 p-1 text-white text-sm md:text-base text-bold rounded border border-rv-navy"
      >
        Totals
      </Link>
      <button
        className="max-w-24 p-1 text-sm md:text-base text-white font-bold rounded flex items-center justify-center"
        onClick={handleResetCart}
      >
        Reset
      </button>
      <button className="max-w-24 p-1 text-white first-line:text-sm md:text-base text-bold rounded border border-rv-navy ">
        Login
      </button>
    </div>
  );
}

export default ToolBar;
