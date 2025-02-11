import { ProductItem } from "@/lib/ProductItem";
import {
  DISCOUNT_CONDITIONS,
  DiscountInfoType,
  DiscountOptionType,
} from "@/app/_types/DiscountTypes";
import { DiscountItem } from "@/lib/DiscountItem";

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
      familyPlanEligible,
    });
    const pricesArray = data[i].slice(3).map((price) => Number(price));

    newProduct.addPrices(indexes, pricesArray);

    list[category].push(newProduct);
  }
}

//isolate and organize discount information into object
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
    const discountObject: any = {};

    if (headers.length !== rowData.length) {
      return "Headers and row data must have the same length";
    }

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].trim();
      const value = rowData[j];
      if (header === "checkboxConditions" && value) {
        discountObject[header] = value.split(",").map((cond) => {
          return { label: cond.trim(), conditionMet: false };
        });
      } else if (header in DISCOUNT_CONDITIONS && value !== "FALSE") {
        discountObject["internalConditions"] =
          discountObject["internalConditions"] || []; // Ensure array exists
        discountObject["internalConditions"].push({
          condition: header, // Use the header as the condition name
          requiredValue: value,
          conditionMet: false,
        });
      } else {
        discountObject[header] = value.trim();
      }
    }

    discountsInfo.push(discountObject);
  }

  return discountsInfo;
}

//create discountItem

export function createDiscountItem(discountData: DiscountInfoType[]) {
  return discountData.map((discount) => {
    return new DiscountItem(discount);
  });
}
