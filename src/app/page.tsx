// app/page.tsx

import PricingSheet from "./components/PricingSheet/PricingSheet";

//TODO: add add another product button
/**
 * when homepage is open, default one pair is shown
 */

export default function Home() {
  return (
    <div className="">
      <h1>Home Page</h1>
      <PricingSheet />
    </div>
  );
}
