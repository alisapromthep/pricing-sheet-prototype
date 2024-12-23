"use client";

import LensForm from "../LensForm/LensForm";
import OptionsForm from "../OptionsForm/OptionsForm";
import DiscountForm from "../DiscountForm/DiscountForm";
import { useGoogleSheetsContext } from "@/lib/context/GoogleSheetsContext";
import { fetchLabels, fetchOptions } from "@/services/organizeData";
import { usePricingContext } from "@/lib/context/PricingContext";

import { useState, useEffect } from "react";

const bogo = [
  "Apply BOGO?",
  "All sets purchased within 30 days?",
  "discount will be applied to",
  "discount amount",
];

const family = [
  "Apply Family Plan?",
  "Are there at least two family members in this order?",
  "Lens discount will be applied to",
  "discount amount",
];
const Form: React.FC = () => {
  const [inputFramePrice, setInputFramePrice] = useState<string>("");

  const data = useGoogleSheetsContext();
  const pricingTool = usePricingContext();

  const { currentProduct, setCurrentProduct, createProduct, updateProduct } =
    pricingTool;

  if (!data) {
    return <p>loading...</p>;
  }
  const { sheetsData, loading, error } = data;
  const { addOn, lens, lensTreatment, mcssAddon, packages, superflexAddon } =
    sheetsData;

  console.log(currentProduct);

  useEffect(() => {
    createProduct();
  }, []);

  const handleInputFramePrice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputFramePrice((prev) => e.target.value);
    updateProduct({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  //TODO: Add styling

  return (
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="framePrice">
          Frame Price
          <input
            name="framePrice"
            type="number"
            value={inputFramePrice}
            onChange={handleInputFramePrice}
            placeholder="Enter frame price"
          />
        </label>
        <LensForm />
        <OptionsForm
          optionsData={fetchOptions(lensTreatment)}
          label={fetchLabels(lensTreatment)}
          name="lensTreatment"
        />
        <OptionsForm
          optionsData={fetchOptions(addOn)}
          label={fetchLabels(addOn)}
          name="addOn"
        />
      </form>
      <div>
        <label className="flex">
          Lens Subtotal
          <p>{currentProduct.lensSubTotal}</p>
        </label>
        <label className="flex">
          Frame & Lens Subtotal
          <p>{currentProduct.total}</p>
        </label>
      </div>
      {/* <div>
        <h4>order subtotal</h4>
        <div>
          <label>
            total frame price
            <p>$$$</p>
          </label>
          <label>
            total lenses
            <p>$$$</p>
          </label>
          <label>
            order subtotal
            <p>$$$</p>
          </label>
        </div>
      </div>
      <div>
        <h3>Discounts</h3>
        <p>BOGO</p>
        <DiscountForm labelsArray={bogo} />
        <p>Family Plan</p>
        <DiscountForm labelsArray={family} />
      </div> */}
    </div>
  );
};

export default Form;
