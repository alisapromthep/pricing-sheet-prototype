import { DiscountOptionType } from "@/app/_types/DiscountTypes";

export class DiscountItem {
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  applyToProduct: string;
  applyOn: string;
  conditionLabel: string;
  conditionName: string;
  canCombine: boolean;
  condition: DiscountConditionType[];
}
