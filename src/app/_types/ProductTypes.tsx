export interface PricesType {
  [key: string]: number | string;
}

export interface ProductItemsType {
  category: string;
  model: string;
  familyPlanEligible: boolean;
  prices: PricesType;
}
