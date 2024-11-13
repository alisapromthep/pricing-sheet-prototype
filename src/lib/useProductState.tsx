import { ProductItem } from "./ProductItem";
import { fetchProductIndexes } from "@/services/organizeData";
import { useState, useEffect } from "react";

type CategoryMap = { [category: string]: string[] };

export const useProductState = function (data) {
  const [productIndexes, setProductIndexes] = useState([]);
  const [productListByCategory, setProductListByCategory] = useState({});

  useEffect(() => {
    const indexes = fetchProductIndexes(data[0]);
    setProductIndexes(indexes);
    const length = data.length;

    const listByCategory = data
      .slice(1)
      .reduce((acc: CategoryMap, [category]) => {
        if (!acc[category]) {
          acc[category] = [];
        }

        return acc;
      }, {});

    for (let i = 1; i < length; i++) {
      const [category, model, familyPlanEligible] = data[i]; // Destructure data array elements
      const newProduct = new ProductItem({
        category,
        model,
        familyPlanEligible,
      });
      const pricesArray = data[i].slice(3).map((price) => Number(price));

      newProduct.addPrices(productIndexes, pricesArray);
      listByCategory[category].push(newProduct);
    }

    setProductListByCategory(listByCategory);
  }, []);

  return { productIndexes, productListByCategory };
};
