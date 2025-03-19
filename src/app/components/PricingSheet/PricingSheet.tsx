"use client";

import { useEffect } from "react";
import Form from "../Form/Form";
import { usePricingContext } from "@/lib/context/PricingContext";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function PricingSheet() {
  const pricingTool = usePricingContext();
  const { cart, setCart, addForm } = pricingTool;
  useEffect(() => {
    console.log("pricingtool", pricingTool);
    console.log("pricingcontenxt", usePricingContext);
    console.log("localStorage", localStorage.getItem("cart"));
  }, []);

  useEffect(() => {
    console.log("running pricingsheeet");
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
    // <div className="row-span-4 xl:col-span-4">
    <div className="col-span-4">
      <div className="mx-2 mt-2  xl:hidden">
        <button
          onClick={addForm}
          className=" bg-lime-500 font-bold p-2 rounded first-letter:flex items-center"
        >
          <IoMdAddCircleOutline />
          Add Another Pair
        </button>
      </div>
      <div
        className={`grid gap-4 ${
          cart.length === 1
            ? "grid-cols-1"
            : cart.length === 2
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {cart.map((form, index) => {
          return <Form key={form.id} index={index} formID={form.id} />;
        })}
      </div>
    </div>
  );
}
