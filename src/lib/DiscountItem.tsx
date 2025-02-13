import { ProductItem } from "@/lib/ProductItem";
import { selectedProductType } from "@/app/_types/ProductTypes";
import {
  DISCOUNT_CONDITIONS,
  DiscountInfoType,
} from "@/app/_types/DiscountTypes";
import {
  checkMinPurchase,
  checkFamilyPlanEligibility,
  checkCanCombine,
} from "@/services/discountUtilities";
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
      (this.checkboxConditions = checkboxConditions),
      (this.internalConditions = internalConditions);
  }

  checkInternalConditions(
    cart: selectedProductType[],
    discountSelected: DiscountInfoType[]
  ) {
    let allConditionsMet = true;

    this.internalConditions = this.internalConditions.map((cond) => {
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
          console.log("combine result", result);
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

    return allConditionsMet;
  }
}
