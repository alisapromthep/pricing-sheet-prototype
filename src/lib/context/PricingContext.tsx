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
  DISCOUNT_CONDITIONS,
  DiscountOptionType,
  DiscountInfoType,
  DiscountedPriceType,
} from "@/app/_types/DiscountTypes";
import {
  organizeDiscountInfo,
  createDiscountItem,
} from "@/services/organizeData";
import { useGoogleSheetsContext } from "./GoogleSheetsContext";
import { ProductItem } from "../ProductItem";
import { DiscountItem } from "../DiscountItem";

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
  addform: () => void;
  availableDiscounts: DiscountInfoType[];
  discountSelected: string[];
  setDiscountSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const data = useGoogleSheetsContext();

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
  const [availableDiscounts, setAvailableDiscounts] = useState<
    DiscountInfoType[]
  >([]);
  const [discountSelected, setDiscountSelected] = useState<DiscountItem[]>([]);
  const [discountedPrice, setDiscountedPrice] = useState<DiscountedPriceType[]>(
    []
  );

  const [discountErrors, setDiscountErrors] = useState<string[]>([]);

  if (!data) {
    return <p>loading...</p>;
  }
  const { sheetsData, loading, error } = data;

  //get discount Information

  useEffect(() => {
    if (sheetsData.discounts) {
      const structuredDiscounts = organizeDiscountInfo(sheetsData.discounts);
      const discountItems = createDiscountItem(structuredDiscounts);
      console.log(discountItems);

      setAvailableDiscounts(discountItems);
    }
  }, [sheetsData]);

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

  //Add new form

  const addForm = () => {
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

  //Individual discount condition checks function in discountConditionChecks file
  //
  const isDiscountApplicable = (discountSelected: DiscountOptionType[]) => {
    //no discount selected
    if (!discountSelected || discountSelected.length === 0) {
      console.log("no discount selected");
      return setDiscountErrors((prev) => [...prev, "no discount selected"]);
    }
    //check if discounts are being combine, if not combinable
    if (discountSelected.length > 1) {
    }
  };
  //TODO: Add discount calculations, BOGO and Family plans
  const applyDiscount = () => {};

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
        availableDiscounts,
        discountSelected,
        setDiscountSelected,
        isDiscountApplicable,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export function usePricingContext() {
  return useContext(PricingContext);
}
