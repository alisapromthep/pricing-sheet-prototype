import { ProductItem } from "@/lib/ProductItem";
import { selectedProductType } from "@/app/_types/ProductTypes";
import { DiscountInfoType } from "@/app/_types/DiscountTypes";

export function checkMinPurchase(
  cart: selectedProductType[],
  condition: { [key: string]: any }
) {
  if (cart.length < (condition.requiredValue || 0)) {
    return {
      conditionMet: false,
      errorMessage: `Minimum purchase required: ${condition.requiredValue} items.`,
    };
  } else {
    return { conditionMet: true, errorMessage: "" };
  }
}

export function checkFamilyPlanEligibility(
  cart: selectedProductType[],
  condition: { [key: string]: any }
) {
  let allFamilyEligible = true;
  let notEligibleProduct: string = "";
  console.log("cart", cart);
  if (condition.requiredValue) {
    cart.forEach((product) => {
      const { selectedProductItem: item } = product;
      console.log(product);
      if (!item.familyPlanEligible) {
        notEligibleProduct += item.id;
        allFamilyEligible = false;
      }
    });
    if (!allFamilyEligible) {
      return {
        conditionMet: true,
        errorMessage: `${notEligibleProduct} is not eligible for family plan discount`,
      };
    } else {
      return { conditionMet: true, errorMessage: "" };
    }
  } else {
    return { conditionMet: true, errorMessage: "" };
  }
}
