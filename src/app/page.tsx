import PricingSheet from "./components/PricingSheet/PricingSheet";
import ToolBar from "./components/ToolBar/ToolBar";

export default function Home() {
  return (
    <div className="flex">
      <PricingSheet />
      <ToolBar />
    </div>
  );
}
