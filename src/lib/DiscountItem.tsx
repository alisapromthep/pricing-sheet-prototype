import { ProductItem } from "@/lib/ProductItem";
import { selectedProductType } from "@/app/_types/ProductTypes";
import { DISCOUNT_CONDITIONS } from "@/app/_types/DiscountTypes";
export class DiscountItem {
  id: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  applyToProduct: string[];
  applyOn: string;
  canCombine: string;
  checkboxConditions: { id: string; label: string; conditionMet: boolean }[];
  internalConditions: {
    condition: string;
    requiredValue?: any;
    conditionMet: boolean;
    errorMessage?: string;
  }[];

  constructor({
    id = "",
    name = "",
    description = "",
    discountType = "",
    discountValue = 0,
    applyToProduct = [],
    applyOn = "",
    canCombine = "FALSE",
    checkboxConditions = [],
    internalConditions = [],
  } = {}) {
    (this.id = id),
      (this.name = name),
      (this.description = description),
      (this.discountType = discountType),
      (this.discountValue = discountValue),
      (this.applyToProduct = applyToProduct),
      (this.applyOn = applyOn),
      (this.canCombine = canCombine),
      (this.checkboxConditions = checkboxConditions),
      (this.internalConditions = internalConditions);
  }

  checkInternalConditions(cart: selectedProductType[]) {
    let allConditionsMet = true;

    this.internalConditions = this.internalConditions.map((cond) => {
      let conditionMet = false;
      let errorMessage = "";

      switch (cond.condition) {
        case DISCOUNT_CONDITIONS.FAMILY_PLAN_PRODUCT_ELIGIBILITY:
          let allFamilyEligible = true;
          let notEligibleProduct: string = "";

          cart.forEach((product) => {
            const { selectedProductItem: item } = product;
            console.log(product);
            //TODO: when adding new product to cart, item.familyPlan becomes undefined
            if (!item.familyPlanEligible) {
              notEligibleProduct += item.id;
              allFamilyEligible = false;
            }
          });
          if (!allFamilyEligible) {
            errorMessage = `${notEligibleProduct} is not eligible for family plan discount`;
          } else {
            conditionMet = true;
          }
          break;

        case DISCOUNT_CONDITIONS.MIN_PURCHASE:
          if (cart.length < (cond.requiredValue || 0)) {
            errorMessage = `Minimum purchase required: ${cond.requiredValue} items.`;
          } else {
            conditionMet = true;
          }
          break;

        default:
          errorMessage = "Unknown discount condition.";
      }

      // If any condition fails, mark allConditionsMet as false
      if (!conditionMet) {
        allConditionsMet = false;
      }

      return { ...cond, conditionMet, errorMessage };
    });

    return allConditionsMet;
  }
}
