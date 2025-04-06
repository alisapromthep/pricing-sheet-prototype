"use client;";

import Header from "../components/Header/Header";
import ToolBar from "../components/ToolBar/ToolBar";
import PricingSheet from "../components/PricingSheet/PricingSheet";
import DiscountForm from "../components/DiscountForm/DiscountForm";
import SubTotal from "../components/SubTotal/SubTotal";

export default function HoyaCalculator() {
  return (
    <div className="">
      <Header />
      <ToolBar />
      <PricingSheet />
      <div className="p-2 md:p-8 md:grid md:grid-cols-2">
        <DiscountForm />
        <SubTotal />
      </div>
    </div>
  );
}
