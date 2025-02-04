import { selectedProductType } from "@/app/_types/ProductTypes";

export const isMinPurchasedMet = (
  formsArray: selectedProductType[],
  minRequirement: number
) => {
  return formsArray.length - 1 > minRequirement;
};

export const isProductFamilyPlanEligible = productId;
