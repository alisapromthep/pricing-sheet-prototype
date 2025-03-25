"use client";
import DiscountForm from "./components/DiscountForm/DiscountForm";
import PricingSheet from "./components/PricingSheet/PricingSheet";
import SubTotal from "./components/SubTotal/SubTotal";
import ToolBar from "./components/ToolBar/ToolBar";

export default function Home() {
  console.log("PricingSheet", PricingSheet);
  return (
    <div className="">
      <ToolBar />
      <PricingSheet />
      <DiscountForm />
      <SubTotal />
    </div>
  );
}
