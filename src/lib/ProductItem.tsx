type PricesType = {
  [key: string]: number;
};

export class ProductItem {
  id: string;
  category: string;
  model: string;
  familyPlanEligible: boolean;
  prices: PricesType;

  constructor({
    id = "",
    category = "",
    model = "",
    familyPlanEligible = false,
  } = {}) {
    this.id = id;
    this.category = category;
    this.model = model;
    this.familyPlanEligible = familyPlanEligible;
    this.prices = {};
  }

  addPrices(productIndexes, prices) {
    const productPrices = productIndexes.reduce((acc, type, i) => {
      acc[type] = prices[i];
      return acc;
    }, {});

    this.prices = productPrices;
  }
}
