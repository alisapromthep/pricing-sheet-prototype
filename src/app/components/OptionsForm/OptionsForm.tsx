"use client";

import { organizeOptionsData } from "@/services/organizeData";
import { useState, useEffect } from "react";
import { usePricingContext } from "@/lib/context/PricingContext";

type FormProps = {
  optionsData: string[][];
  label: string;
  name: string;
  formID: string;
};

const OptionsForm: React.FC<FormProps> = ({
  optionsData,
  label,
  name,
  formID,
}) => {
  const [error, setError] = useState<boolean>(false);
  const optionObject = organizeOptionsData(optionsData);

  const pricingTool = usePricingContext();
  const { cart, updateProduct, updateOptions } = pricingTool;
  const currentForm = cart.find((form) => form.id === formID);

  const handleSelectOption = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    formID: string
  ) => {
    const selected = optionObject?.find(
      (object) => object.option === e.target.value
    );

    if (selected) {
      updateOptions(name, selected, formID);
    } else {
      setError(true);
    }
  };

  if (!optionsData || !label) {
    return <p>loading...</p>;
  }

  return (
    <div className="flex flex-col">
      <fieldset>
        <legend className="font-bold my-1 flex items-center justify-between">
          {label}
        </legend>
        <legend className="">
          Choose up to 5 <span className="lowercase">{label}</span>
        </legend>
        <div className="grid grid-cols-2">
          {optionObject?.map((option, i) => {
            //console.log("optionObject", option);
            const isOptionChecked = currentForm[name].some(
              (opt) => opt.option === option.option
            );
            return (
              <div key={i} className="grid grid-cols-2 justify-between">
                <label>
                  <input
                    type="checkbox"
                    id=""
                    name="label"
                    value={option.option}
                    className="mr-1"
                    onChange={(e) => handleSelectOption(e, name, formID)}
                    checked={isOptionChecked}
                  />
                  {option.option}
                </label>
                <div className="flex flex-row">
                  <p className="mr-2 text-gray-500">{option.price}</p>
                  <p className="text-gray-500">{option.family}</p>
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>
      <div className="my-1 flex items-center justify-between">
        <p>Price</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {error ? "unavailable" : `$${currentForm[`${name}Price`] || ""}`}
        </p>
      </div>
      {/* <label className="my-1 flex items-center justify-between">
        {label}
        <select
          value={selectedOptions.option}
          onChange={handleSelectOption}
          className="block w-2/3 text-wrap mx-2 px-4 py-2 pr-8 bg-gray-100 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline
          "
        >
          {optionObject?.map((optionObject, i) => {
            return (
              <option key={i} value={optionObject.option}>
                {optionObject.option}
              </option>
            );
          })}
        </select>
      </label>
      <div className="my-1 flex items-center justify-between">
        <p>Price</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {error ? "unavailable" : `$${selectedOptions.price ?? 0}`}
        </p>
      </div>
      <div className="my-1 flex items-center justify-between">
        <p>Family Plan Eligible?</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {error ? "unavailable" : `${selectedOptions.family ?? "N/A"}`}
        </p>
      </div> */}
    </div>
  );
};

export default OptionsForm;
