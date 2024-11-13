"use client";

import { useEffect, useState } from "react";
import { useProductState } from "@/lib/useProductState";
import {
  fetchProductTypes,
  fetchProductListInfo,
} from "@/services/organizeData";

type FormProps = {
  data: string[][];
};

interface PricesType {
  [key: string]: number;
}

interface ProductItemsType {
  category: string;
  model: string;
  familyPlanEligible: boolean;
  prices: PricesType;
}

const Form: React.FC<FormProps> = ({ data }) => {
  const { productIndexes, productListByCategory } = useProductState(data);
  const productCategories = fetchProductTypes(data);

  const [selectedType, setSelectedType] = useState<string>(
    productCategories[0]
  );
  const [productList, setProductList] = useState<ProductItemsType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedProductInfo, setSelectedProductInfo] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the product list for the initially selected type
    const initialProductList = productListByCategory[selectedType];
    console.log(productListByCategory[selectedType]);
    setProductList(initialProductList);
  }, [selectedType, productListByCategory]);

  // useEffect(() => {
  //   const productList = fetchProductListInfo(selectedType, data);
  //   setProductList(productList);
  // }, [selectedType]);

  // useEffect(() => {
  //   const productInfo = productList.find(
  //     (product) => product[1] === selectedProduct
  //   );
  //   setSelectedProductInfo(productInfo || []);
  // }, [selectedProduct]);

  const handleSelectType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  return (
    <form className="text-black flex flex-col">
      <label>
        Select Product Category
        <select onChange={handleSelectType}>
          {productCategories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        Select Product
        <select>
          {productList &&
            productList.map((product, i) => (
              <option key={i} value={product.model}>
                {product.model}
              </option>
            ))}
        </select>
      </label>
      <label>
        Select Index
        <select>
          {productIndexes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <div className="flex">
        <p>Base Price</p>
        <p></p>
      </div>
    </form>
  );
};

export default Form;
