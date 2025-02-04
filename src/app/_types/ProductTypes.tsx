export interface PricesType {
  [key: string]: number | string;
}

export interface ProductItemsType {
  id: string;
  category: string;
  model: string;
  familyPlanEligible: boolean;
  prices: PricesType;
}

export interface selectedProductType {
  id: string;
  framePrice: number;
  selectedProductItem: ProductItemsType;
  selectedIndex: string;
  indexPrice: number;
  lensTreatment: string;
  lensTreatmentPrice: number;
  addOn: { [key: string]: string };
  addOnPrice: number;
  lensSubTotal: number;
  total: number;
}
