"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { PricesType, ProductItemsType } from "@/app/_types/ProductTypes";
import { ProductItem } from "../ProductItem";
interface selectedProductType {
  id: string;
  framePrice: number;
  selectedProductItem: ProductItemsType;
  selectedIndex: { [key: string]: string };
  lensTreatment: { [key: string]: string };
  addOn: { [key: string]: string };
  total: number;
}

interface PricingContextType {
  selectedProducts: selectedProductType[];
  setSelectedProducts: React.Dispatch<
    React.SetStateAction<selectedProductType[]>
  >;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialSelectedProduct: selectedProductType = {
    id: "",
    framePrice: 0,
    selectedProductItem: new ProductItem({}),
    selectedIndex: {},
    lensTreatment: {},
    addOn: {},
    total: 0,
  };

  const [selectedProducts, setSelectedProducts] = useState<
    selectedProductType[]
  >([initialSelectedProduct]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  return (
    <PricingContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export function usePricingContext() {
  return useContext(PricingContext);
}
