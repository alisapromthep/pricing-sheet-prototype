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
  return <form>{}</form>;
};

export default OptionsForm;
