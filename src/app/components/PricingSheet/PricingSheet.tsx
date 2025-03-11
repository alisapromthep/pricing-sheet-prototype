"use client";

import { useEffect } from "react";
import Form from "../Form/Form";
import { usePricingContext } from "@/lib/context/PricingContext";

export default function PricingSheet() {
  const pricingTool = usePricingContext();
  const { cart, setCart, addForm } = pricingTool;

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      addForm();
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  return (
    <div className="col-span-2">
      <div className="flex flex-wrap">
        {cart.map((form, index) => {
          return <Form key={form.id} index={index} formID={form.id} />;
        })}
      </div>
    </div>
  );
}
