"use client";

import { useEffect } from "react";
import Form from "../Form/Form";
import { usePricingContext } from "@/lib/context/PricingContext";

export default function PricingSheet() {
  const pricingTool = usePricingContext();

  const { cart, setCart, addForm } = pricingTool;

  useEffect(() => {
    addForm();
  }, []);

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  return (
    <div>
      <div className="flex flex-wrap">
        {cart.map((form, index) => {
          return <Form key={form.id} index={index} formID={form.id} />;
        })}
      </div>
    </div>
  );
}
