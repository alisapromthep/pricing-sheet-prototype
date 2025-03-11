import PricingSheet from "./components/PricingSheet/PricingSheet";
import ToolBar from "./components/ToolBar/ToolBar";

export default function Home() {
  return (
    <div className="grid grid-cols-3">
      <PricingSheet />
      <ToolBar />
    </div>
  );
}
