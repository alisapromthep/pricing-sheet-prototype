"use client";

import { useEffect } from "react";
import LensForm from "../LensForm/LensForm";
import OptionsForm from "../OptionsForm/OptionsForm";
import { useGoogleSheetsContext } from "@/lib/context/GoogleSheetsContext";
import { getLabels, getOptions } from "@/services/organizeData";
import { usePricingContext } from "@/lib/context/PricingContext";
import { IoMdCloseCircleOutline } from "react-icons/io";
interface FormProps {
  index: number;
  formID: string;
}

//TODO: optimized loading time, data are static: don't need to fetch each time

const Form: React.FC<FormProps> = ({ index, formID }) => {
  const data = useGoogleSheetsContext();
  const pricingTool = usePricingContext();
  const { cart, updateProduct, deleteForm, clearForm } = pricingTool;

  const currentForm = cart.find((form) => form.id === formID);

  useEffect(() => {
    updateProduct({ pairNumber: index + 1 }, formID);
  }, []);

  if (!data) {
    return <p>loading...</p>;
  }
  const { sheetsData, loading, error } = data;
  const { addOn, lens, lensTreatment, mcssAddon, packages, superflexAddon } =
    sheetsData;

  const handleInputFramePrice = (
    e: React.KeyboardEvent<HTMLInputElement>,
    formID
  ) => {
    const { name, value } = e.target;
    const updatedValue = value === "" ? null : Number(value);

    updateProduct({ [name]: updatedValue }, formID);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-md m-4 p-4 border border-gray-200">
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
            value={currentForm.framePrice || ""}
            onChange={(e) => handleInputFramePrice(e, formID)}
            placeholder="Enter frame price"
          />
        </label>
        <LensForm formID={formID} />
        <h4 className="font-bold my-2">Lens Treatments & Add Ons</h4>
        <div className="">
          <OptionsForm
            optionsData={getOptions(lensTreatment)}
            label={getLabels(lensTreatment)}
            name="lensTreatment"
            formID={formID}
          />
          <OptionsForm
            optionsData={getOptions(addOn)}
            label={getLabels(addOn)}
            name="addOn"
            formID={formID}
          />
        </div>
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
    </div>
  );
};

export default Form;
