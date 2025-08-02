import {
  ProductItemsType,
  selectedProductType,
} from "@/app/_types/ProductTypes";
import { ProductItem } from "@/lib/ProductItem";
import { SheetDataType, SheetContentType } from "@/app/_types/DataTypes";
export function getProductTypes(data: string[]) {
  if (!data) {
    return;
  }
  const productTypes: string[] = [];

  for (let i = 1; i < data.length; i++) {
    if (productTypes.includes(data[i][1]) === false) {
      productTypes.push(data[i][1]);
    }
  }

  return productTypes;
}

export function getProductListInfo(
  selectedType: string,
  productsByCategory: Record<string, any[]>
) {
  return productsByCategory[selectedType];
}

export function getProductIndexes(dataHeaders: string | []) {
  if (!dataHeaders) {
    return;
  }
  const productIndexes = [];
  for (let i = 4; i < dataHeaders.length; i++) {
    productIndexes.push(dataHeaders[i]);
  }
  return productIndexes;
}

export function getSelectedProductInfo(productList, selectedModel: string) {
  const productInfo = productList?.find(
    (product) => product.model === selectedModel
  );

  return productInfo;
}

export function getLensBasePrice(
  productInfo: selectedProductType,
  selectedIndex: string
) {
  if (!productInfo || !selectedIndex) {
    return;
  }
  return productInfo?.prices[selectedIndex];
}

export function organizeOptionsData(data: SheetContentType) {
  if (!data) {
    return;
  }
  return data.map((option) => ({
    option: option[0],
    price: option[1],
    family: option[2],
  }));
}

export function getLabels(sheetData: SheetContentType) {
  if (!sheetData || sheetData.length === 0) {
    return;
  }

  if (!sheetData[0] || sheetData[0].length === 0) {
    return;
  }
  return sheetData[0][0];
}

export function getOptions(sheetData: SheetContentType) {
  if (!sheetData) {
    return;
  }
  return sheetData.slice(1);
}

//function that goes through the array of lens and pick out a list of lens categories
export function getCategoriesList(data: any[]) {
  if (!data) {
    return;
  }
  const listByCategory = data
    .slice(1)
    .reduce((acc: Record<string, any[]>, [_id, category]) => {
      if (category) {
        if (!acc[category]) {
          acc[category] = [];
        }
      }
      return acc;
    }, []);

  return listByCategory;
}

//fill in the categories with products

export function fillInProductCategories(
  data: SheetContentType,
  list: [],
  indexes: number
) {
  if (!data) {
    return;
  }
  for (let i = 1; i < data.length; i++) {
    const [id, category, model, familyPlanEligible] = data[i]; // Destructure data array elements

    const newProduct = new ProductItem({
      id,
      category,
      model,
      familyPlanEligible: familyPlanEligible === "TRUE",
    });
    const pricesArray = data[i].slice(4).map((price) => Number(price));

    newProduct.addPrices(indexes, pricesArray);

    list[category].push(newProduct);
  }
  return list;
}
