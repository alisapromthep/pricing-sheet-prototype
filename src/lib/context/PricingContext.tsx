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
      lensSubTotal: 0,
      total: 0,
    };

    return newProduct;
  };

  const updateProduct = (name: string, value: string | number) => {
    //if prices gets update, the total and subtotal gets updated respectively
    setCurrentProduct((prev) => {
      let updatedLensSubTotal = prev.lensSubTotal;
      let updatedTotal = prev.total;

      // Update lensSubTotal for lens-related prices change
      if (name === "lensTreatmentPrice" || name === "indexPrice") {
        updatedLensSubTotal =
          (name === "lensTreatmentPrice"
            ? Number(value)
            : prev.lensTreatmentPrice) +
          (name === "indexPrice" ? Number(value) : prev.indexPrice);
      }

      //updating total if framePrice is updating
      if (name === "framePrice") {
        updatedTotal = Number(value) + updatedLensSubTotal;
      }
      return {
        ...prev,
        [name]: value,
        lensSubTotal: updatedLensSubTotal,
        total: updatedTotal,
      };
    });
  };

  //TODO: Add Product to the selectedProductArray, for multiple products

  return (
    <PricingContext.Provider
      value={{
        currentProduct,
        setCurrentProduct,
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
