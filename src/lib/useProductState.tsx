import { ProductItem } from "./ProductItem";
import { fetchProductIndexes } from "@/services/organizeData";

type CategoryMap = { [category: string]: string[] };

export const useProductState = function (data) {
  const productIndexes = fetchProductIndexes(data[0]);
  const length = data.length;

  const productListByCategory = data
    .slice(1)
    .reduce((acc: CategoryMap, [category]) => {
      if (!acc[category]) {
        acc[category] = [];
      }

      return acc;
    }, {});

  for (let i = 1; i < length; i++) {
    const [category, model, familyPlanEligible] = data[i]; // Destructure data array elements
    const newProduct = new ProductItem({ category, model, familyPlanEligible });
    const pricesArray = data[i].slice(3).map((price) => Number(price));

    newProduct.addPrices(productIndexes, pricesArray);
    productListByCategory[category].push(newProduct);
  }

  return { productListByCategory };
};
