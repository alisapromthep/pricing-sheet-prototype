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
import {
  getSelectedProductInfo,
  getLensBasePrice,
} from "@/services/organizeData";

interface totalPriceType {
  totalFramePrice: number;
  totalLensPrice: number;
  orderSubTotal: number;
}

interface PricingContextType {
  currentProduct: selectedProductType;
  setCurrentProduct: React.Dispatch<React.SetStateAction<selectedProductType>>;
  selectedProductsArray: selectedProductType[];
  setSelectedProductsArray: React.Dispatch<
    React.SetStateAction<selectedProductType[]>
  >;
  totalPrice: totalPriceType;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  createProduct: () => void;
  updateProduct: (
    name: keyof selectedProductType,
    value: string | number
  ) => void;
  cart: selectedProductType[];
  setCart: React.Dispatch<React.SetStateAction<selectedProductType[]>>;
  deleteForm: (formID: string) => void;
  clearForm: (formID: string) => void;
  updateTotalPrice: () => void;
  addForm: () => void;
  updateLensBasePrice: (
    productListByCategory: Record<string, ProductItemsType[]>,
    selectedCategory: string,
    selectedModel: string,
    selectedIndex: string,
    formID: string
  ) => void;
  updateOptions: (
    name: keyof selectedProductType,
    value: string | number
  ) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialForm: selectedProductType = {
    id: "",
    pairNumber: 0,
    framePrice: 0,
    category: "",
    model: "",
    selectedIndex: "",
    lensBasePrice: 0,
    familyPlanEligible: false,
    lensTreatment: [],
    lensTreatmentPrice: 0,
    addOn: [],
    addOnPrice: 0,
    lensSubTotal: 0,
    total: 0,
    discounted: false,
  };

  const initialTotalPrice: totalPriceType = {
    totalFramePrice: 0,
    totalLensPrice: 0,
    orderSubTotal: 0,
  };

  const initialDiscountedPrice: DiscountedPriceType = {
    discountNames: "",
    discountAppliedTo: [],
    discountAmount: 0,
  };

  const uid = new ShortUniqueId();
  const [currentProduct, setCurrentProduct] =
    useState<selectedProductType>(initialForm);
  const [cart, setCart] = useState<selectedProductType[]>([]);
  const [totalPrice, setTotalPrice] =
    useState<totalPriceType>(initialTotalPrice);

  //TODO: create a cart cap at 3

  const createProduct = () => {
    const newProduct = {
      ...initialForm,
      id: uid.rnd(),
    };

    setCurrentProduct(newProduct);
    return newProduct;
  };

  //Add new form

  const addForm = () => {
    const newForm = createProduct();
    setCart((prev) => [...prev, newForm]);
  };

  //update add ons

  const updateOptions = (
    updates: { [key: string]: string | number },
    formID: string
  ) => {
    setCart((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === formID) {
          let updateOptionPrice = 0;
          let updateOptionsSelected = [];
          console.log(updates);
        }
        return form;
      });
    });
  };

  //Add function to calculate the order subtotal

  const updateTotalPrice = () => {
    const updatedTotalPrice = cart.reduce((accu, form) => {
      return {
        totalFramePrice: Number(accu.totalFramePrice + (form.framePrice || 0)),
        totalLensPrice: Number(accu.totalLensPrice + (form.lensSubTotal || 0)),
        orderSubTotal: Number(accu.orderSubTotal + (form.total || 0)),
      };
    }, initialTotalPrice);

    setTotalPrice(updatedTotalPrice);
  };

  const updateProduct = (
    updates: { [key: string]: string | number },
    formID: string
  ) => {
    setCart((prevForms) => {
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
            Number(updates.lensBasePrice ?? updatedForm.lensBasePrice) +
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
        return form;
      });
    });
  };
  const updateLensBasePrice = (
    productListByCategory: Record<string, ProductItemsType[]>,
    selectedCategory: string,
    selectedModel: string,
    selectedIndex: string,
    formID: string
  ) => {
    const selectedProductInfo = productListByCategory[selectedCategory];
    const productInfo = getSelectedProductInfo(
      selectedProductInfo,
      selectedModel
    );
    const updatedLensBasePrice = getLensBasePrice(productInfo, selectedIndex);

    updateProduct({ lensBasePrice: updatedLensBasePrice }, formID);
  };

  const deleteForm = (formID: string) => {
    setCart((prev) => prev.filter((form) => form.id !== formID));
  };

  //Add Clear function, to reset all to initial state

  const clearForm = (formID: string) => {
    setCart((prev) => {
      return cart.map((form, i) => {
        if (form.id === formID) {
          return initialForm;
        }
        return form;
      });
    });
  };

  return (
    <PricingContext.Provider
      value={{
        currentProduct,
        setCurrentProduct,
        totalPrice,
        setTotalPrice,
        createProduct,
        updateProduct,
        cart,
        setCart,
        deleteForm,
        clearForm,
        updateTotalPrice,
        addForm,
        updateLensBasePrice,
        updateOptions,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export function usePricingContext() {
  return useContext(PricingContext);
}
