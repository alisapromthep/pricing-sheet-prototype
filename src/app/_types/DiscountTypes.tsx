export interface DiscountInfoType {
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  applyToProduct: string;
  applyOn: string;
  conditionLabel: string;
  condition: DiscountConditionType[];
}

export const DISCOUNT_CONDITIONS = {
  PURCHASE_WITHIN_30_DAYS: "PURCHASE_WITHIN_30_DAYS",
  MIN_FAMILY_MEMBERS_PURCHASES: "MIN_FAMILY_MEMBERS_PURCHASES",
  FAMILY_PLAN_PRODUCT_ELIGIBILITY: "FAMILY_PLAN_PRODUCT_ELIGIBILITY",
  MIN_PURCHASE: "MIN_PURCHASE",
};

interface DiscountConditionType {
  condition: string | number;
  errorMessage?: string; // Optional error message
}

export interface DiscountOptionType {
  name: string;
  conditions: {
    [key in keyof typeof DISCOUNT_CONDITIONS]?: DiscountConditionType;
  };
}
