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
  selectedIndex: string;
  indexPrice: number;
  lensTreatment: string;
  lensTreatmentPrice: number;
  addOn: { [key: string]: string };
  lensSubTotal: number;
  total: number;
}

interface PricingContextType {
  selectedProduct: selectedProductType;
  setSelectedProduct: React.Dispatch<React.SetStateAction<selectedProductType>>;
  selectedProductsArray: selectedProductType[];
  setSelectedProductsArray: React.Dispatch<
    React.SetStateAction<selectedProductType[]>
  >;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  updateProduct: (
    name: keyof selectedProductType,
    value: string | number
  ) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialSelectedProduct: selectedProductType = {
    id: "",
    framePrice: 0,
    selectedProductItem: new ProductItem({}),
    selectedIndex: "",
    indexPrice: 0,
    lensTreatment: "",
    lensTreatmentPrice: 0,
    addOn: {},
    lensSubTotal: 0,
    total: 0,
  };

  const [selectedProduct, setSelectedProduct] = useState<selectedProductType>(
    initialSelectedProduct
  );
  const [selectedProductsArray, setSelectedProductsArray] = useState<
    selectedProductType[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  //TODO: create product function, give it an ID and start with initialSelectedProduct

  const updateProduct = (name: string, value: string | number) => {
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //TODO: Add Product to the selectedProductArray, for multiple products

  return (
    <PricingContext.Provider
      value={{
        selectedProduct,
        setSelectedProduct,
        selectedProductsArray,
        setSelectedProductsArray,
        totalPrice,
        setTotalPrice,
        updateProduct,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export function usePricingContext() {
  return useContext(PricingContext);
}
