"use client";

import { useEffect } from "react";
import Form from "../Form/Form";
import { usePricingContext } from "@/lib/context/PricingContext";
import { IoMdAddCircleOutline } from "react-icons/io";

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

  return (
    <div
      className={`grid gap-2 
    sm:grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3`}
    >
      {cart.map((form, index) => {
        return <Form key={form.id} index={index} formID={form.id} />;
      })}
    </div>
  );
}
