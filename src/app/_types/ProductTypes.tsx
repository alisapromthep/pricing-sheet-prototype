export interface PricesType {
  [key: string]: number | string;
}

export interface ProductItemsType {
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

export interface discountInfoType {
  name: string;
  description: string;
  conditions: string;
  application_conditions: string;
  appliesTo: string;
  qualifyingQuantity: string;
  discount: number;
  typeOfDiscount: string;
}
