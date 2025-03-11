"use client";

import { organizeOptionsData } from "@/services/organizeData";
import { useState } from "react";
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
  const { cart, updateProduct } = pricingTool;
  const currentForm = cart.find((form) => form.id === formID);
  const selectedOptions = currentForm[name];

  const handleSelectOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = optionObject?.find(
      (object) => object.option === e.target.value
    );
    if (selected) {
      const updateInfo = {
        [name]: selected,
        [`${name}Price`]: Number(selected.price),
      };
      updateProduct(updateInfo, formID);
    } else {
      setError(true);
    }
  };

  if (!optionsData || !label) {
    return <p>loading...</p>;
  }

  return (
    <div className="flex flex-col">
      <label className="my-1 flex items-center justify-between">
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
      </div>
    </div>
  );
};

export default OptionsForm;
