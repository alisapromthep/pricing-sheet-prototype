import { ProductItem } from "@/lib/ProductItem";
import {
  DISCOUNT_CONDITIONS,
  DiscountInfoType,
  DiscountOptionType,
} from "@/app/_types/DiscountTypes";
import { DiscountItem } from "@/lib/DiscountItem";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId();

export function fetchProductTypes(data: string[]) {
  if (!data) {
    return;
  }
  let productTypes: string[] = [];

  for (let i = 1; i < data.length; i++) {
    if (productTypes.includes(data[i][1]) === false) {
      productTypes.push(data[i][1]);
    }
  }

  return productTypes;
}

export function fetchProductListInfo(
  selectedType: string,
  productsByCategory: {}
) {
  return productsByCategory[selectedType];
}

export function fetchProductIndexes(dataHeaders: []) {
  if (!dataHeaders) {
    return;
  }
  const productIndexes = [];
  for (let i = 4; i < dataHeaders.length; i++) {
    productIndexes.push(dataHeaders[i]);
  }
  return productIndexes;
}

export function fetchSelectedProductInfo(productList, selectedModel: string) {
  const productInfo = productList.find(
    (product) => product.model === selectedModel
  );

  return productInfo;
}

export function calculateBasePrice(productInfo, selectedIndex: string) {
  return productInfo?.prices[selectedIndex];
}

export function organizeOptionsData(data: string[][]) {
  if (!data) {
    return;
  }
  return data.map((option) => ({
    option: option[0],
    price: option[1],
    family: option[2],
  }));
}

export function fetchLabels(sheetData) {
  if (!sheetData) {
    return;
  }
  return sheetData[0][0];
}

export function fetchOptions(sheetData) {
  if (!sheetData) {
    return;
  }
  return sheetData.slice(1);
}

//function that goes through the array of lens and pick out a list of lens categories
export function fetchCategoriesList(data) {
  const listByCategory = data.slice(1).reduce((acc, [_id, category]) => {
    if (!acc[category]) {
      acc[category] = [];
    }
    return acc;
  }, []);

  return listByCategory;
}

//fill in the categories with products

export function fillInProductCategories(data, list, indexes) {
  for (let i = 1; i < data.length; i++) {
    const [id, category, model, familyPlanEligible] = data[i]; // Destructure data array elements

    const newProduct = new ProductItem({
      id,
      category,
      model,
      familyPlanEligible: familyPlanEligible === "TRUE",
    });
    const pricesArray = data[i].slice(3).map((price) => Number(price));

    newProduct.addPrices(indexes, pricesArray);

    list[category].push(newProduct);
  }
}
