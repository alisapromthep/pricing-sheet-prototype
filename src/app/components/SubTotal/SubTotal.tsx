import React from "react";
import { useEffect } from "react";
import { usePricingContext } from "@/lib/context/PricingContext";

function SubTotal() {
  const pricingTool = usePricingContext();
  const { totalPrice, formsArray, updateTotalPrice } = pricingTool;

  useEffect(() => {
    updateTotalPrice();
  }, [formsArray]);

  return (
    <div>
      <h4>order subtotal</h4>
      <div>
        <label>
          total frame price
          <p>{`$${totalPrice.totalFramePrice}`}</p>
        </label>
        <label>
          total lenses
          <p>{`$${totalPrice.totalLensPrice}`}</p>
        </label>
        <label>
          order subtotal
          <p>{`$${totalPrice.orderSubTotal}`}</p>
        </label>
      </div>
    </div>
  );
}

export default SubTotal;
