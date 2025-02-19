export interface DiscountDataType {
  [key: string]: string | number | boolean | string[];
}

export interface DiscountItemType {
  id: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  applyToProduct: string[];
  applyOn: string;
  canCombine: string;
  checkboxConditions: {
    id: string;
    label: string;
    conditionMet: boolean;
    errorMessage?: string;
  }[];
  internalConditions: {
    condition: string;
    requiredValue?: any;
    conditionMet: boolean;
    errorMessage?: string;
  }[];
}

export const DISCOUNT_CONDITIONS = {
  FAMILY_PLAN_PRODUCT_ELIGIBILITY: "FAMILY_PLAN_PRODUCT_ELIGIBILITY",
  MIN_PURCHASE: "MIN_PURCHASE",
  CAN_COMBINE: "CAN_COMBINE",
};

interface DiscountConditionType {
  condition: string | number;
  conditionMet?: boolean;
  errorMessage?: string; // Optional error message
}

//discount object inside discountSelected state
/** discount = {
    * name:'BOGO',
    * conditionMET: FALSE,
    * errorMessage: '',
   } */

interface DiscountedPriceType {
  discountNames: string;
  discountAppliedTo: string[];
  discountAmount: number;
}
