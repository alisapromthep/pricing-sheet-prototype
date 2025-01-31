export const DISCOUNT_CONDITIONS = {
  PURCHASE_WITHIN_30_DAYS: "PURCHASE_WITHIN_30_DAYS",
  MULTIPLE_FAMILY_MEMBERS: "MULTIPLE_FAMILY_MEMBERS",
  PRODUCT_ELIGIBILITY: "PRODUCT_ELIGIBILITY",
  MIN_PURCHASE_AMOUNT: "MIN_PURCHASE_AMOUNT",
};

interface DiscountCondition {
  name: string;
  message?: string; // Optional error message
}

export interface DiscountOption {
  name: string;
  conditions: {
    [key in keyof typeof DISCOUNT_CONDITIONS]?: DiscountCondition;
  };
}
