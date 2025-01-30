"use client";

import React from "react";
import { usePricingContext } from "@/lib/context/PricingContext";
import { IoMdAddCircleOutline } from "react-icons/io";
import SubTotal from "../SubTotal/SubTotal";

function ToolBar() {
  const pricingTool = usePricingContext();

  const { addForm } = pricingTool;

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
        <label>
          <input type="checkbox" value="" />
        </label>
      </div>
      <SubTotal />
    </div>
  );
}

export default ToolBar;
