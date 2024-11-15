"use client";

import { organizeOptionsData } from "@/services/organizeData";
import { mock } from "node:test";

type FormProps = {
  optionsData: string[][];
  labelsArray: string[];
};

const OptionsForm: React.FC<FormProps> = ({ optionsData, labelsArray }) => {
  const optionObject = organizeOptionsData(optionsData);
  console.log(optionObject);
  return (
    <form className="flex flex-col">
      {labelsArray.map((label, i) => {
        return (
          <label key={i}>
            {label}
            <select>
              {optionsData.map((option, k) => (
                <option key={k}>{option[i]}</option>
              ))}
            </select>
          </label>
        );
      })}
    </form>
  );
};

export default OptionsForm;
