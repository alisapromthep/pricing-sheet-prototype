import {
  ProductItemsType,
  selectedProductType,
} from "@/app/_types/ProductTypes";

export const isMinPurchasedMet = (
  cart: selectedProductType[],
  minRequirement: number
) => {
  return cart.length - 1 > minRequirement;
};

export const isFamilyPlanEligibility = (productItem: ProductItemsType) => {
  return productItem.familyPlanEligible;
};
