"use client";

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
    <div
      id="total-section"
      className="text-sm md:text-base capitalize lg:grid lg:grid-cols-2"
    >
      <div>
        <h4 className="font-bold">order subtotal</h4>
        <div className="flex flex-col">
          <label className="">
            total frame price:
            <span className="font-bold">{`$${totalPrice.totalFramePrice}`}</span>
          </label>
          <label className="">
            total lenses:
            <span className="font-bold">{`$${totalPrice.totalLensPrice}`}</span>
          </label>
          <label className="">
            order subtotal:
            <span className="font-bold">{`$${totalPrice.orderSubTotal}`}</span>
          </label>
        </div>
      </div>
      <div>
        {discountedProducts && discountedProducts.length > 0
          ? discountedProducts.map((price, i) => {
              return (
                <div key={i}>
                  <h5 className="font-bold">Discounts</h5>
                  <p>
                    Discount applied to:
                    <span className="font-bold">
                      Pair#{`${price.pairNumber}`}
                    </span>
                  </p>
                  <p>
                    Discount amount{" "}
                    <span className="font-bold">
                      ${`${price.discountAmount}`}
                    </span>
                  </p>
                  <p>
                    Discounted Price{" "}
                    <span className="font-bold">
                      ${`${price.discountedPrice}`}
                    </span>
                  </p>
                </div>
              );
            })
          : ""}
        <p className="font-bold">
          Total Costs:<span className="ml-1">{`$${discountedPrice}`}</span>
        </p>
      </div>
    </div>
  );
}

export default SubTotal;
