import PricingSheet from "./components/PricingSheet/PricingSheet";
import ToolBar from "./components/ToolBar/ToolBar";

export default function Home() {
  console.log("PricingSheet", PricingSheet);
  return (
    // <div className="grid grid-row-5 xl:grid-cols-5">
    <div className="grid grid-cols-5">
      <PricingSheet />
      <ToolBar />
    </div>
  );
}
