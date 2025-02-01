import { ProductItem } from "@/lib/ProductItem";
import {
  DISCOUNT_CONDITIONS,
  DiscountOptionType,
} from "@/app/_types/DiscountTypes";

export function fetchProductTypes(data: string[]) {
  if (!data) {
    return;
  }
  let productTypes: string[] = [];

  for (let i = 1; i < data.length; i++) {
    if (productTypes.includes(data[i][0]) === false) {
      productTypes.push(data[i][0]);
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
  for (let i = 3; i < dataHeaders.length; i++) {
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
  const listByCategory = data.slice(1).reduce((acc, [category]) => {
    if (!acc[category]) {
      acc[category] = [];
    }
    return acc;
  }, []);

  return listByCategory;
}

//fill in the catogories with products

export function fillInProductCategories(data, list, indexes) {
  for (let i = 1; i < data.length; i++) {
    const [category, model, familyPlanEligible] = data[i]; // Destructure data array elements

    const newProduct = new ProductItem({
      category,
      model,
      familyPlanEligible,
    });
    const pricesArray = data[i].slice(3).map((price) => Number(price));

    newProduct.addPrices(indexes, pricesArray);
    list[category].push(newProduct);
  }
}

//isolate discount information and create discount objects
export function organizeDiscountInfo(
  data: string[]
): DiscountOptionType[] | string {
  if (!Array.isArray(data) || data.length === 0) {
    return "Invalid input: Data must be a non-empty array.";
  }

  const headers = data[0];
  const discountsInfo: any[] = [];

  for (let i = 1; i < data.length; i++) {
    const rowData = data[i];
    const discountObject: any = { conditions: [] };
    console.log(data);

    if (headers.length !== rowData.length) {
      return "Headers and row data must have the same length";
    }

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = rowData[j];

      if (header in DISCOUNT_CONDITIONS && value !== "FALSE") {
        discountObject.conditions.push({
          [header]: {
            condition: value,
          },
        });
      } else {
        discountObject[header] = value;
      }
    }

    discountsInfo.push(discountObject);
  }
  console.log(discountsInfo);

  return discountsInfo;
}
