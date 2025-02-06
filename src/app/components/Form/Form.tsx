"use client";

import LensForm from "../LensForm/LensForm";
import OptionsForm from "../OptionsForm/OptionsForm";
import DiscountForm from "../DiscountForm/DiscountForm";
import { useGoogleSheetsContext } from "@/lib/context/GoogleSheetsContext";
import { fetchLabels, fetchOptions } from "@/services/organizeData";
import { usePricingContext } from "@/lib/context/PricingContext";
import { useState, useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

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

interface FormProps {
  index: number;
  formID: string;
}

const Form: React.FC<FormProps> = ({ index, formID }) => {
  const [inputFramePrice, setInputFramePrice] = useState<string>("");

  const data = useGoogleSheetsContext();
  const pricingTool = usePricingContext();

  const { createProduct, updateProduct, deleteForm, clearForm } = pricingTool;

  if (!data) {
    return <p>loading...</p>;
  }
  const { sheetsData, loading, error } = data;
  const { addOn, lens, lensTreatment, mcssAddon, packages, superflexAddon } =
    sheetsData;
  const { cart } = pricingTool;
  const currentForm = cart.find((form) => form.id === formID);

  useEffect(() => {
    createProduct();
  }, []);

  const handleInputFramePrice = (
    e: React.KeyboardEvent<HTMLInputElement>,
    formID
  ) => {
    const { name, value } = e.target;
    setInputFramePrice((prev) => e.target.value);
    updateProduct({ [name]: Number(value) }, formID);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log(e);
  };

  //TODO: Add styling

  //console.log("currentProduct", currentProduct);

  return (
    <div className="m-4 p-4 border border-gray-200">
      <div className=" flex justify-between">
        <button
          onClick={() => {
            clearForm(formID);
          }}
          className="bg-red-300 font-bold p-2 rounded flex items-center justify-between"
        >
          Clear
        </button>
        <h2 className="font-bold text-lg">Pair {`${index + 1}`}</h2>
        <button
          onClick={() => {
            deleteForm(formID);
          }}
        >
          <IoMdCloseCircleOutline size={24} />
        </button>
      </div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="framePrice" className="my-1 flex justify-between">
          Frame Price
          <input
            name="framePrice"
            type="number"
            value={inputFramePrice}
            onChange={(e) => handleInputFramePrice(e, formID)}
            placeholder="Enter frame price"
          />
        </label>
        <LensForm formID={formID} />
        <h4 className="font-bold my-2">Lens Treatments & Add Ons</h4>
        <OptionsForm
          optionsData={fetchOptions(lensTreatment)}
          label={fetchLabels(lensTreatment)}
          name="lensTreatment"
          formID={formID}
        />
        <OptionsForm
          optionsData={fetchOptions(addOn)}
          label={fetchLabels(addOn)}
          name="addOn"
          formID={formID}
        />
      </form>
      <div>
        <label className="flex items-center justify-between">
          Lens Subtotal
          <p className="mx-2 px-4 py-2 pr-8">
            {`$${currentForm.lensSubTotal || "0"}`}
          </p>
        </label>
        <label className="flex items-center justify-between">
          Frame & Lens Subtotal
          <p className="mx-2 px-4 py-2 pr-8">{`$${
            currentForm.total || "0"
          }`}</p>
        </label>
      </div>
      {/* 
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
