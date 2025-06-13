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
  pairNumber: number;
  framePrice: number;
  category: string;
  model: string;
  selectedIndex: string;
  lensBasePrice: number;
  familyPlanEligible: boolean;
  lensTreatment: { [key: string]: string }[];
  lensTreatmentPrice: number;
  addOn: { [key: string]: string }[];
  addOnPrice: number;
  lensSubTotal: number;
  total: number;
  discounted: boolean;
  productInfo: ProductItemsType;
  [key: string]: any;
}
