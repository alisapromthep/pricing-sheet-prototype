"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { selectedProductType } from "@/app/_types/ProductTypes";
import {
  DISCOUNT_CONDITIONS,
  DiscountOptionType,
  DiscountInfoType,
  DiscountedPriceType,
  DiscountItemType,
} from "@/app/_types/DiscountTypes";
import {
  organizeDiscountInfo,
  createDiscountItem,
} from "@/services/organizeData";
import { useGoogleSheetsContext } from "./GoogleSheetsContext";
import { ProductItem } from "../ProductItem";
import { DiscountItem } from "../DiscountItem";
import {
  checkMinPurchase,
  checkFamilyPlanEligibility,
  checkCanCombine,
} from "@/services/discountUtilities";

interface DiscountContextType {
  availableDiscounts: DiscountInfoType[];
  discountSelected: string[];
  setDiscountSelected: React.Dispatch<React.SetStateAction<string[]>>;
  discountErrors: string[];
  setDiscountErrors: React.Dispatch<React.SetStateAction<string[]>>;
  isDiscountApplicable: (
    cart: selectedProductType[],
    discountSelected: DiscountOptionType[]
  ) => any;
}

const DiscountContext = createContext<DiscountContextType | undefined>(
  undefined
);

export const DiscountProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const data = useGoogleSheetsContext();

  const discountObject: DiscountItemType = {
    id: "",
    name: "",
    description: "",
    discountType: "",
    discountValue: 0,
    applyToProduct: [],
    applyOn: "",
    checkboxConditions: [],
    internalConditions: [],
  };

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

  //Individual discount condition checks function in discountConditionChecks file
  //

  const checkInternalConditions = (
    discount: DiscountItemType,
    cart: selectedProductType[],
    discountSelected: DiscountInfoType[]
  ) => {
    let allConditionsMet = true;
    let {internalConditions} = discount;
 
    const updatedInternalConditions = internalConditions.map((cond) => {
      let result = { conditionMet: false, errorMessage: "" };

      switch (cond.condition) {
        case DISCOUNT_CONDITIONS.FAMILY_PLAN_PRODUCT_ELIGIBILITY:
          result = checkFamilyPlanEligibility(cart, cond);
          break;

        case DISCOUNT_CONDITIONS.MIN_PURCHASE:
          result = checkMinPurchase(cart, cond);
          break;

        case DISCOUNT_CONDITIONS.CAN_COMBINE:
          result = checkCanCombine(discountSelected, cond);
          break;
        default:
          result.errorMessage = "Unknown discount condition.";
      }

      // If any condition fails, mark allConditionsMet as false
      if (!result.conditionMet) {
        allConditionsMet = false;
      }

      return { ...cond, ...result };
    });
    console.log("updatedInternalCondition", updatedInternalConditions);
    internalConditions = updatedInternalConditions;

    return allConditionsMet;
  }
}

  const isDiscountApplicable = (
    cart: selectedProductType[],
    discountSelected: DiscountOptionType[]
  ) => {
    //no discount selected
    if (!discountSelected || discountSelected.length === 0) {
      return;
    }
    setDiscountSelected((prev) => {
      prev.map((discount) => {
        discount.checkInternalConditions(discount, cart, discountSelected);
        return { ...discount };
      });
    });
  };
  //TODO: Add discount calculations, BOGO and Family plans
  const applyDiscount = () => {};

  return (
    <DiscountContext.Provider
      value={{
        availableDiscounts,
        discountSelected,
        setDiscountSelected,
        isDiscountApplicable,
        discountErrors,
        setDiscountErrors,
        applyDiscount,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
};

export function useDiscountContext() {
  return useContext(DiscountContext);
}
