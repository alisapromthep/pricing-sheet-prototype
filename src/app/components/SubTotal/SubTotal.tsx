import React from "react";
import { useEffect } from "react";
import { usePricingContext } from "@/lib/context/PricingContext";
import { useDiscountContext } from "@/lib/context/DiscountContext";

function SubTotal() {
  const pricingTool = usePricingContext();
  const discountTool = useDiscountContext();

  const { totalPrice, cart, updateTotalPrice } = pricingTool;
  const {
    discountSelected,
    discountedPrice,
    discountedProducts,
    updateDiscountedTotal,
  } = discountTool;

  useEffect(() => {
    updateTotalPrice();
  }, [cart]);

  useEffect(() => {
    updateDiscountedTotal(totalPrice, discountedProducts);
  }),
    [discountedProducts];

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
      {discountedProducts && discountedProducts.length > 0
        ? discountedProducts.map((price, i) => {
            return (
              <div key={i}>
                <h5>Discounts</h5>
                <p>Discount applied to: Pair#{`${price.pairNumber}`}</p>
                <p>Discount amount ${`${price.discountAmount}`}</p>
                <p>Discounted Price ${`${price.discountedPrice}`}</p>
              </div>
            );
          })
        : ""}
      <p>Total Costs${`${discountedPrice}`}</p>
    </div>
  );
}

export default SubTotal;
