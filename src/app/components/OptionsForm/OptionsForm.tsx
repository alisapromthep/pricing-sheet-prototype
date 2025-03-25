"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { organizeOptionsData } from "@/services/organizeData";
import { useState, useEffect } from "react";
import { usePricingContext } from "@/lib/context/PricingContext";
import SelectedButton from "../SelectedButton/SelectedButton";

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
  const selectedArr = currentForm[name];

  const handleSelectOption = (
    optionName: string,
    name: string,
    formID: string
  ) => {
    const selected = optionObject?.find(
      (objectObj) => objectObj.option === optionName
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center justify-between gap-2 border p-2 rounded-md">
            {selectedArr.length > 0
              ? selectedArr.map((selected) => selected.option).join(" ")
              : "NONE"}
            <FaChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="bg-white shadow-lg rounded-md w-56 p-2">
          {optionObject?.map((optionObj, i) => {
            let isOptionChecked = currentForm[name].some(
              (opt) => opt.option === optionObj.option
            );
            return (
              <DropdownMenu.Item
                key={i}
                onSelect={() =>
                  handleSelectOption(optionObj.option, name, formID)
                }
                className={`            flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer
              ${isOptionChecked && "font-bold"}`}
              >
                {optionObj.option}
                <span className="mr-2 text-gray-500">{optionObj.price}</span>
                <span className="text-gray-500">{optionObj.family}</span>
                {isOptionChecked && (
                  <FaCheck className="h-4 w-4 text-blue-500" />
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {/* <fieldset>
        <legend className="font-bold my-1 flex items-center justify-between">
          {label}
        </legend>
        <legend className="">
          Choose up to 5 <span className="lowercase">{label}</span>
        </legend>
        <div className="grid grid-cols-2">
          {optionObject?.map((option, i) => {
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
      </fieldset> */}
      <div className="my-1 flex items-center justify-between">
        <p>Price</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {error ? "unavailable" : `$${currentForm[`${name}Price`] || "0"}`}
        </p>
      </div>
    </div>
  );
};

export default OptionsForm;
