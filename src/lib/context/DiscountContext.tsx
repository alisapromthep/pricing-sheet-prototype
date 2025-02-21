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
  DiscountedPriceType,
  DiscountItemType,
} from "@/app/_types/DiscountTypes";
import { useGoogleSheetsContext } from "./GoogleSheetsContext";
import {
  checkMinPurchase,
  checkFamilyPlanEligibility,
  checkCanCombine,
  organizeDiscountInfo,
  verifyCheckBoxConditions,
  verifyInternalConditions,
} from "@/services/discountUtilities";

interface DiscountContextType {
  availableDiscounts: DiscountItemType[];
  discountSelected: DiscountItemType[];
  setDiscountSelected: React.Dispatch<React.SetStateAction<DiscountItemType[]>>;
  discountErrors: string;
  setDiscountErrors: React.Dispatch<React.SetStateAction<string>>;
  isDiscountApplicable: (
    cart: selectedProductType[],
    discountSelected: DiscountItemType[]
  ) => any;
  applyDiscount: (
    cart: selectedProductType[],
    discountSelected: DiscountItemType[]
  ) => any;
}

const DiscountContext = createContext<DiscountContextType | undefined>(
  undefined
);

export const DiscountProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const data = useGoogleSheetsContext();

  const [availableDiscounts, setAvailableDiscounts] = useState<
    DiscountItemType[]
  >([]);
  const [discountSelected, setDiscountSelected] = useState<DiscountItemType[]>(
    []
  );
  const [discountedPrice, setDiscountedPrice] = useState<DiscountedPriceType[]>(
    []
  );

  const [discountErrors, setDiscountErrors] = useState<string>("");

  if (!data) {
    return <p>loading...</p>;
  }
  const { sheetsData, loading, error } = data;

  //get discount Information

  useEffect(() => {
    if (sheetsData.discounts) {
      const discountItems = organizeDiscountInfo(sheetsData.discounts);
      setAvailableDiscounts(discountItems);
    }
  }, [sheetsData]);

  //Individual discount condition checks function in discountConditionChecks file
  //

  const checkInternalConditions = (
    discount: DiscountItemType,
    cart: selectedProductType[],
    discountSelected: DiscountItemType[]
  ) => {
    let allInternalConditionsMet = true;
    let { internalConditions } = discount;

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
        allInternalConditionsMet = false;
      }

      return { ...cond, ...result };
    });
    internalConditions = updatedInternalConditions;

    return { updatedInternalConditions, allInternalConditionsMet };
  };

  const isDiscountApplicable = (
    cart: selectedProductType[],
    discountSelected: DiscountItemType[]
  ) => {
    //no discount selected
    if (!discountSelected || discountSelected.length === 0) {
      return;
    }

    setDiscountSelected((prevDiscounts) => {
      const updatedDiscounts = prevDiscounts.map((discount) => {
        const { updatedInternalConditions, allInternalConditionsMet } =
          checkInternalConditions(discount, cart, prevDiscounts);

        return {
          ...discount,
          internalConditions: updatedInternalConditions,
          allInternalConditionsMet,
        };
      });
      // Prevent infinite re-renders by checking if the state actually changed
      if (JSON.stringify(updatedDiscounts) !== JSON.stringify(prevDiscounts)) {
        return updatedDiscounts;
      }
      return prevDiscounts;
    });
  };

  //TODO: Add discount calculations, BOGO and Family plans
  const applyDiscount = (cart, discountSelected) => {
    // console.log("applyDiscount", discountSelected);
    const checkboxResult = verifyCheckBoxConditions(discountSelected);
    const internalResult = verifyInternalConditions(discountSelected);
    console.log("discounts", discountSelected);
    console.log(checkboxResult, internalResult);
    //check that all conditions are met
    //if not met return error
    //all conditions met
    if (!checkboxResult || !internalResult) {
      setDiscountErrors((prev) => "some conditions are not met");
      return;
    } else {
      //need for calculations:
      //applyOn, discountType, discountValue, applyToProduct
      //loop through the cart for lesser value of the according to applyToProduct
      //apply discount calculation using discountType and value
    }
  };

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
