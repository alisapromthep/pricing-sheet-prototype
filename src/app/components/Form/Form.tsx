"use client";

import { useEffect, useState } from "react";
import { fetchProductTypes } from "@/services/organizeData";

type FormProps = {
  data: string[][];
};

const Form: React.FC<FormProps> = ({ data }) => {
  const [selectedType, setSelectedType] = useState<string>("");

  const productTypes = fetchProductTypes(data);

  const handleSelectType = () => {};

  return (
    <form className="text-black">
      <label>
        Select Product Type
        <select onChange={handleSelectType}>
          {productTypes.map((type, i) => (
            <option key={i}>{type}</option>
          ))}
        </select>
      </label>
    </form>
  );
};

export default Form;
