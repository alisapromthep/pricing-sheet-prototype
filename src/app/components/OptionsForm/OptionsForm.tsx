"use client";

import { organizeOptionsData } from "@/services/organizeData";

type FormProps = {
  optionsData: string[][];
  labelsArray: string[];
};

const OptionsForm: React.FC<FormProps> = ({ optionsData, labelsArray }) => {
  const optionObject = organizeOptionsData(optionsData);

  if (!optionsData || !labelsArray) {
    return <p>loading...</p>;
  }

  return (
    <div className="flex flex-col">
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
    </div>
  );
};

export default OptionsForm;
