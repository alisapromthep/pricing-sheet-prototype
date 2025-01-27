"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ShortUniqueId from "short-unique-id";
import {
  PricesType,
  ProductItemsType,
  selectedProductType,
} from "@/app/_types/ProductTypes";
import { ProductItem } from "../ProductItem";

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
  formsArray: selectedProductType[];
  setFormsArray: React.Dispatch<React.SetStateAction<selectedProductType[]>>;
  deleteForm: (formID: string) => void;
  clearForm: (formID: string) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialForm: selectedProductType = {
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
  const [currentProduct, setCurrentProduct] =
    useState<selectedProductType>(initialForm);
  const [formsArray, setFormsArray] = useState<selectedProductType[]>([]);
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
    return newProduct;
  };

  const updateProduct = (
    updates: { [key: string]: string | number },
    formID: string
  ) => {
    setFormsArray((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === formID) {
          let updatedLensSubTotal = 0;
          let updatedTotal = 0;

          // Merge updates with the current form
          const updatedForm = { ...form, ...updates };

          // Recalculate lensSubTotal
          updatedLensSubTotal =
            Number(
              updates.lensTreatmentPrice ?? updatedForm.lensTreatmentPrice
            ) +
            Number(updates.indexPrice ?? updatedForm.indexPrice) +
            Number(updates.addOnPrice ?? (updatedForm.addOnPrice || 0));

          // Recalculate total
          updatedTotal =
            Number(updates.framePrice ?? updatedForm.framePrice) +
            updatedLensSubTotal;

          return {
            ...updatedForm,
            lensSubTotal: updatedLensSubTotal,
            total: updatedTotal,
          };
        }
        return form; // Return unchanged form if ID doesn't match
      });
    });
  };

  const deleteForm = (formID: string) => {
    setFormsArray((prev) => prev.filter((form) => form.id !== formID));
  };

  //TODO: Add Clear function, to reset all to initial state

  const clearForm = (formID: string) => {
    setFormsArray((prev) => {
      return formsArray.map((form, i) => {
        if (form.id === formID) {
          return initialForm;
        }
        return form;
      });
    });
  };

  //TODO: Add function to calculate the order subtotal
  //TODO: Add discount calculations, BOGO and Family plans

  return (
    <PricingContext.Provider
      value={{
        currentProduct,
        setCurrentProduct,
        totalPrice,
        setTotalPrice,
        createProduct,
        updateProduct,
        formsArray,
        setFormsArray,
        deleteForm,
        clearForm,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export function usePricingContext() {
  return useContext(PricingContext);
}
