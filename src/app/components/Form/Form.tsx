"use client";

import { useEffect, useState } from "react";
import {
  fetchProductTypes,
  fetchProductListInfo,
} from "@/services/organizeData";

type FormProps = {
  data: string[][];
};

const Form: React.FC<FormProps> = ({ data }) => {
  const productTypes = fetchProductTypes(data);

  const [selectedType, setSelectedType] = useState<string>(productTypes[0]);
  const [productList, setProductList] = useState<string[][]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedProductInfo, setSelectedProductInfo] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the product list for the initially selected type
    const initialProductList = fetchProductListInfo(selectedType, data);
    setProductList(initialProductList);

    // Automatically select the first product from the fetched list, if available
    if (initialProductList.length > 0) {
      setSelectedProduct(initialProductList[0][1]);
      setSelectedProductInfo(initialProductList[0]);
    }
  }, [selectedType, data]);

  useEffect(() => {
    const productList = fetchProductListInfo(selectedType, data);
    setProductList(productList);
  }, [selectedType]);

  useEffect(() => {
    const productInfo = productList.find(
      (product) => product[1] === selectedProduct
    );
    setSelectedProductInfo(productInfo || []);
  }, [selectedProduct]);

  const handleSelectType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
  };

  return (
    <form className="text-black flex flex-col">
      <label>
        Select Product Type
        <select onChange={handleSelectType}>
          {productTypes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label>
        Select Product
        <select onChange={handleSelectProduct}>
          {productList.map((product, i) => (
            <option key={i} value={product[1]}>
              {product[1]}
            </option>
          ))}
        </select>
      </label>
      <div className="flex">
        <p>Base Price</p>
        <p>{selectedProductInfo[2]}</p>
      </div>
    </form>
  );
};

export default Form;
