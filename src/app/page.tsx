"use client";
import DiscountForm from "./components/DiscountForm/DiscountForm";
import PricingSheet from "./components/PricingSheet/PricingSheet";
import SubTotal from "./components/SubTotal/SubTotal";
import ToolBar from "./components/ToolBar/ToolBar";
import Header from "./components/Header/Header";

export default function Home() {
  console.log("PricingSheet", PricingSheet);
  return (
    <div className="">
      <Header />
      <ToolBar />
      <PricingSheet />
      <DiscountForm />
      <SubTotal />
    </div>
  );
}
