"use client";
import React from "react";
import DiscountForm from "../components/DiscountForm/DiscountForm";
import PricingSheet from "../components/PricingSheet/PricingSheet";
import SubTotal from "../components/SubTotal/SubTotal";
import ToolBar from "../components/ToolBar/ToolBar";

function HoyaCalculator() {
  //console.log("PricingSheet", PricingSheet);

  return (
    <div className="">
      <ToolBar />
      <PricingSheet />
      <div className="p-2 md:p-8 md:grid md:grid-cols-2">
        <DiscountForm />
        <SubTotal />
      </div>
    </div>
  );
}

export default HoyaCalculator;
