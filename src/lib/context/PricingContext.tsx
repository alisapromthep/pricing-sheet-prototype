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
  setTotalPrice: React.Dispatch<React.SetStateAction<totalPriceType>>;
  createProduct: () => void;
  updateProduct: (
    updates: Partial<selectedProductType>,
    formID: string | number
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
    optionName: string,
    updatedInfo: {
      option: string;
      price: number | string;
      familyEligible?: boolean;
    },
    formID: string
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
    if (cart.length === 3) {
      return;
    }
    const newForm = createProduct();
    setCart((prev) => [...prev, newForm]);
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

  const calculateLensSubTotal = (
    form: selectedProductType,
    updates: Partial<selectedProductType>
  ) => {
    const lensTreatmentPrice = Number(
      updates.lensTreatmentPrice ?? form.lensTreatmentPrice
    );
    const lensBasePrice = Number(updates.lensBasePrice ?? form.lensBasePrice);
    const addOnPrice = Number(updates.addOnPrice ?? (form.addOnPrice || 0));

    const lensSubTotal = lensTreatmentPrice + lensBasePrice + addOnPrice;
    const total = Number(updates.framePrice ?? form.framePrice) + lensSubTotal;

    return { lensSubTotal, total };
  };

  const updateOptions = (
    optionName: keyof selectedProductType,
    updatedInfo: { option: string; price: number; familyEligible?: boolean },
    formID: string
  ) => {
    setCart((prevForms) =>
      prevForms.map((form) => {
        if (form.id !== formID) return form;

        const currentOptions = Array.isArray(form[optionName])
          ? form[optionName]
          : [];

        const isAlreadySelected = currentOptions.some(
          (opt) => opt.option === updatedInfo.option
        );

        let updatedOptions;
        if (isAlreadySelected) {
          updatedOptions = currentOptions.filter(
            (opt) => opt.option !== updatedInfo.option
          );
        } else {
          updatedOptions =
            currentOptions.length < 5
              ? [...currentOptions, updatedInfo]
              : currentOptions;
        }

        const updatedPrice = updatedOptions.reduce(
          (sum, opt) => sum + Number(opt.price),
          0
        );

        // Update product prices using updateProduct
        const updates = {
          [optionName]: updatedOptions,
          [`${optionName}Price`]: updatedPrice,
        };
        const { lensSubTotal, total } = calculateLensSubTotal(form, updates);
        return { ...form, ...updates, lensSubTotal, total };
      })
    );
  };

  const updateProduct = (
    updates: Partial<selectedProductType>,
    formID: string
  ) => {
    setCart((prevForms) =>
      prevForms.map((form) => {
        if (form.id !== formID) return form;

        // Merge updates with the current form
        const updatedForm = { ...form, ...updates };

        // Recalculate totals
        const { lensSubTotal, total } = calculateLensSubTotal(form, updates);

        return {
          ...updatedForm,
          lensSubTotal,
          total,
        };
      })
    );
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
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricingContext must be used within a PricingProvider");
  }
  return context;
}

// export function usePricingContext() {
//   return useContext(PricingContext);
// }
