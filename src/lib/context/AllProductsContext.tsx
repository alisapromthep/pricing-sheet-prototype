"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { selectedProductType } from "@/app/_types/ProductTypes";

interface AllProductsContextType {
  formsArray: selectedProductType[];
  setFormsArray: React.Dispatch<React.SetStateAction<selectedProductType[]>>;
  deleteForm: (formID: string) => void;
}

const AllProductsContext = createContext<AllProductsContextType | undefined>(
  undefined
);

export const AllProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formsArray, setFormsArray] = useState<selectedProductType[]>([]);

  const deleteForm = (formID: string) => {
    setFormsArray((prev) => prev.filter((form) => form.id !== formID));
  };

  return (
    <AllProductsContext.Provider
      value={{ formsArray, setFormsArray, deleteForm }}
    >
      {children}
    </AllProductsContext.Provider>
  );
};

export function useAllProductsContext() {
  return useContext(AllProductsContext);
}
