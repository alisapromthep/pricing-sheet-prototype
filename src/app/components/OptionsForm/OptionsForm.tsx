"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaCheck, FaChevronDown, FaTimes } from "react-icons/fa";
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
  const { cart, updateOptions } = pricingTool;
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
    <div className="text-sm flex flex-col">
      <p className="font-bold">{label}</p>
      <p className="text-sm text-gray-500">Select up to 5 {name}</p>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="border-rv-navy flex items-center justify-between gap-2 border p-2 rounded-md w-64">
            {selectedArr.length > 0 ? "Select more..." : "NONE"}
            <FaChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white shadow-lg rounded-md w-64 p-2">
          {optionObject?.map((optionObj, i) => {
            const isChecked = selectedArr.some(
              (opt) => opt.option === optionObj.option
            );
            return (
              <DropdownMenu.Item
                key={i}
                onSelect={() =>
                  handleSelectOption(optionObj.option, name, formID)
                }
                className={`border-rv-navy flex items-center justify-between p-2 hover:bg-sky-50 cursor-pointer ${
                  isChecked && "font-bold"
                }`}
              >
                <span>{optionObj.option}</span>
                <span className="text-gray-500">{optionObj.price}</span>
                <span className="text-gray-500">{optionObj.family}</span>
                {isChecked && <FaCheck className="h-4 w-4 text-blue-500" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Selected Items List */}
      <div className="flex flex-wrap gap-2">
        {selectedArr.map((selected) => (
          <div
            key={selected.option}
            className="flex items-center gap-1 bg-sky-100 text-rv-navy px-3 py-1 rounded-full text-sm"
          >
            <span>{selected.option}</span>
            <button
              onClick={() => handleSelectOption(selected.option, name, formID)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm">An error occurred. Try again.</p>
      )}
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
