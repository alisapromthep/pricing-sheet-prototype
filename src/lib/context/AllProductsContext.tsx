"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { selectedProductType } from "@/app/_types/ProductTypes";

interface AllProductsContextType {
  formsArray: selectedProductType[];
  setFormsArray: React.Dispatch<React.SetStateAction<selectedProductType[]>>;
}

const AllProductsContext = createContext<AllProductsContextType | undefined>(
  undefined
);

export const AllProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formsArray, setFormsArray] = useState<selectedProductType[]>([]);

  return (
    <AllProductsContext.Provider value={{ formsArray, setFormsArray }}>
      {children}
    </AllProductsContext.Provider>
  );
};

export function useAllProductsContext() {
  return useContext(AllProductsContext);
}
