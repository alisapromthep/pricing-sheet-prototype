"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ShortUniqueId from "short-unique-id";
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
  addOnPrice: number;
  lensSubTotal: number;
  total: number;
}

interface PricingContextType {
  currentProduct: selectedProductType;
  setCurrentProduct: React.Dispatch<React.SetStateAction<selectedProductType>>;
  selectedProductsArray: selectedProductType[];
  setSelectedProductsArray: React.Dispatch<
    React.SetStateAction<selectedProductType[]>
  >;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  createProduct: () => void;
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
    addOnPrice: 0,
    lensSubTotal: 0,
    total: 0,
  };

  const uid = new ShortUniqueId();
  const [currentProduct, setCurrentProduct] = useState<selectedProductType>(
    initialSelectedProduct
  );
  const [selectedProductsArray, setSelectedProductsArray] = useState<
    selectedProductType[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  //create product function, give it an ID and return empty product info with an id.

  const createProduct = () => {
    const newProduct = {
      id: uid.rnd(),
      framePrice: 0,
      selectedProductItem: new ProductItem({}),
      selectedIndex: "",
      indexPrice: 0,
      lensTreatment: "",
      lensTreatmentPrice: 0,
      addOn: {},
      addOnPrice: 0,
      lensSubTotal: 0,
      total: 0,
    };

    setCurrentProduct(newProduct);
  };

  const updateProduct = (updates: { [key: string]: string | number }) => {
    setCurrentProduct((prev) => {
      let updatedLensSubTotal = 0;
      let updatedTotal = 0;

      // Apply updates to the state
      const newState = { ...prev, ...updates };

      // Recalculate lensSubTotal
      updatedLensSubTotal =
        Number(updates.lensTreatmentPrice ?? newState.lensTreatmentPrice) +
        Number(updates.indexPrice ?? newState.indexPrice) +
        Number(updates.addOnPrice ?? (newState.addOnPrice || 0));

      // Recalculate total
      updatedTotal =
        Number(updates.framePrice ?? newState.framePrice) + updatedLensSubTotal;

      return {
        ...newState,
        lensSubTotal: updatedLensSubTotal,
        total: updatedTotal,
      };
    });
  };

  //TODO: Add function to calculate the order subtotal
  //TODO: Add discount calculations, BOGO and Family plans

  //TODO: Add Product to the selectedProductArray, for multiple products
  //TODO: Add function to reset currentProduct when add another product is added

  return (
    <PricingContext.Provider
      value={{
        currentProduct,
        setCurrentProduct,
        selectedProductsArray,
        setSelectedProductsArray,
        totalPrice,
        setTotalPrice,
        createProduct,
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
