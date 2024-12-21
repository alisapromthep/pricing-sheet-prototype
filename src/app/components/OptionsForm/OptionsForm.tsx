"use client";

import { organizeOptionsData } from "@/services/organizeData";
import { useState } from "react";

type FormProps = {
  optionsData: string[][];
  label: string;
};

const OptionsForm: React.FC<FormProps> = ({ optionsData, label }) => {
  const [optionPrice, setOptionPrice] = useState<number>(0);
  const [familyPlan, setFamilyPlan] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const optionObject = organizeOptionsData(optionsData);

  const handleSelectOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = optionObject?.find(
      (object) => object.option === e.target.value
    );
    if (selected) {
      setOptionPrice(Number(selected.price));
      setFamilyPlan(selected.family);
    } else {
      setError(true);
    }
  };

  if (!optionsData || !label) {
    return <p>loading...</p>;
  }

  return (
    <div className="flex flex-col">
      <label>
        {label}
        <select onChange={handleSelectOption}>
          {optionObject?.map((optionObject, i) => {
            return (
              <option key={i} value={optionObject.option}>
                {optionObject.option}
              </option>
            );
          })}
        </select>
      </label>
      <div className="flex">
        <p>Price</p>
        <p>{error ? "unavailable" : `$${optionPrice}`}</p>
      </div>
      <div className="flex">
        <p>Family Plan Eligible?</p>
        <p>{error ? "unavailable" : `${familyPlan}`}</p>
      </div>
    </div>
  );
};

export default OptionsForm;
