import React from "react";
import { useEffect } from "react";
import { usePricingContext } from "@/lib/context/PricingContext";
import { useDiscountContext } from "@/lib/context/DiscountContext";

function SubTotal() {
  const pricingTool = usePricingContext();
  const discountTool = useDiscountContext();

  const { totalPrice, cart, updateTotalPrice } = pricingTool;
  const { discountSelected } = discountTool;

  useEffect(() => {
    updateTotalPrice();
  }, [cart]);

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
      {discountSelected && discountSelected.length > 0 ? (
        <div>
          <h5>Discounts</h5>
          <p>Discount applied to:</p>
          <p>Discount amount</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default SubTotal;
