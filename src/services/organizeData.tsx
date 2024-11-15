export function fetchProductTypes(data: string[][]) {
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
  return data.map((option) => ({
    option: option[0],
    price: option[1],
    family: option[2],
  }));
}
