import { ProductItemsType } from "@/app/_types/ProductTypes";
import { ProductItem } from "@/lib/ProductItem";

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

export function getLensBasePrice(productInfo, selectedIndex: string) {
  if (!productInfo || !selectedIndex) {
    return;
  }
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

export function getLabels(sheetData) {
  if (!sheetData) {
    return;
  }
  return sheetData[0][0];
}

export function getOptions(sheetData) {
  if (!sheetData) {
    return;
  }
  return sheetData.slice(1);
}

//function that goes through the array of lens and pick out a list of lens categories
export function getCategoriesList(data) {
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

export function fillInProductCategories(data, list, indexes) {
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
