type PricesType = {
  [key: string]: number;
};

export class ProductItem {
  category: string;
  model: string;
  familyPlanEligible: boolean;
  prices: PricesType;

  constructor({ category = "", model = "", familyPlanEligible = false } = {}) {
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
