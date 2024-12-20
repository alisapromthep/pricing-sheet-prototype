import { ProductItem } from "./ProductItem";
import {
  fetchProductTypes,
  fetchProductIndexes,
} from "@/services/organizeData";
import { useState, useEffect } from "react";
import { useGoogleSheetsContext } from "./context/GoogleSheetsContext";

type CategoryMap = { [category: string]: string[] };

export const useProductState = function () {
  const data = useGoogleSheetsContext();
  const { sheetsData, loading, error } = data || {};

  const [productIndexes, setProductIndexes] = useState([]);
  const [productListByCategory, setProductListByCategory] = useState({});
  const [lensCategories, setLensCategories] = useState<string[]>([]);
  //console.log(sheetsData);
  //setProductCategories(data.lens[0]);
  useEffect(() => {
    if (loading || error) {
      return;
    }

    console.log("inside useEffect?", sheetsData);
    const productCategories = fetchProductTypes(sheetsData?.lens);
    console.log("lens??", productCategories);

    const indexes = fetchProductIndexes(sheetsData?.lens[0]);
    if (indexes) {
      setProductIndexes(indexes);
      const length = sheetsData?.lens.length;

      const listByCategory = sheetsData?.lens.slice(1).reduce(
        (acc: CategoryMap, [category]) => {
          if (!acc[category]) {
            acc[category] = [];
          }

          return acc;
        },
        { sheetsData }
      );
    }

    if (indexes) {
      for (let i = 1; i < length; i++) {
        const [category, model, familyPlanEligible] = data[i]; // Destructure data array elements
        const newProduct = new ProductItem({
          category,
          model,
          familyPlanEligible,
        });
        const pricesArray = data[i].slice(3).map((price) => Number(price));

        newProduct.addPrices(indexes, pricesArray);
        listByCategory[category].push(newProduct);
      }
    }

    setProductListByCategory(listByCategory);
  }, []);

  return { lensCategories, productIndexes, productListByCategory };
};
