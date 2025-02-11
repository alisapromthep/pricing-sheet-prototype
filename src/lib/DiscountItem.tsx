import { DiscountOptionType } from "@/app/_types/DiscountTypes";

export class DiscountItem {
  id: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  applyToProduct: string[];
  applyOn: string;
  canCombine: boolean;
  checkboxConditions: { key: string; label: string; conditionMet: boolean }[];
  internalConditions: {
    condition: string;
    requiredValue?: any;
    conditionMet: boolean;
  }[];

  constructor({
    id = "",
    name = "",
    description = "",
    discountType = "",
    discountValue = 0,
    applyToProduct = [],
    applyOn = "",
    canCombine = false,
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

  addCheckboxConditions(data) {
    console.log("add checkbox condition", data);
  }

  addinternalConditions(data) {
    console.log("add internal condition", data);
  }

  isMinPurchasedMet = (cart) => {};
}
