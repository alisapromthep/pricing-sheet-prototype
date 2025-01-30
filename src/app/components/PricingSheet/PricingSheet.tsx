"use client";

import { useEffect } from "react";
import Form from "../Form/Form";
import { usePricingContext } from "@/lib/context/PricingContext";

export default function PricingSheet() {
  const pricingTool = usePricingContext();

  const { formsArray, setFormsArray, addForm } = pricingTool;

  useEffect(() => {
    addForm();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap">
        {formsArray.map((form, index) => {
          return <Form key={form.id} index={index} formID={form.id} />;
        })}
      </div>
    </div>
  );
}
