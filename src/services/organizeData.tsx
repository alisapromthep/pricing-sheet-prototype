export function fetchProductTypes(data: string[][]) {
  let productTypes: string[] = [];

  for (let i = 1; i < data.length; i++) {
    if (productTypes.includes(data[i][0]) === false) {
      productTypes.push(data[i][0]);
    }
  }
  return productTypes;
}

export function fetchProductListInfo(productName: string, data: string[][]) {
  const productInfoList = data.filter((product) => product[0] === productName);

  return productInfoList;
}
