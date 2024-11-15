"use client";

import { useEffect, useState } from "react";
import { useProductState } from "@/lib/useProductState";
import {
  fetchProductTypes,
  fetchProductListInfo,
  fetchSelectedProductInfo,
  calculateBasePrice,
} from "@/services/organizeData";

type FormProps = {
  frameData: string[][];
};

interface PricesType {
  [key: string]: number | string;
}

interface ProductItemsType {
  category: string;
  model: string;
  familyPlanEligible: boolean;
  prices: PricesType;
}

const FrameForm: React.FC<FormProps> = ({ frameData }) => {
  const { productIndexes, productListByCategory } = useProductState(frameData);
  const productCategories = fetchProductTypes(frameData);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    productCategories[0]
  );
  const [productList, setProductList] = useState<ProductItemsType[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [selectedProductInfo, setSelectedProductInfo] =
    useState<ProductItemsType>({
      category: "",
      model: "",
      familyPlanEligible: false,
      prices: {} as PricesType,
    });
  const [basePrice, setBasePrice] = useState<number>(0);

  useEffect(() => {
    // Fetch the product list for the initially selected type
    const initialProductList = productListByCategory[selectedCategory];
    setProductList(initialProductList);

    if (initialProductList) {
      setSelectedProductInfo(initialProductList[0]);
      setSelectedModel(initialProductList[0].model);
      setSelectedIndex(productIndexes[0]);
    }
  }, [selectedCategory, productListByCategory]);

  useEffect(() => {
    const productInfo = fetchSelectedProductInfo(productList, selectedModel);
    setSelectedProductInfo(productInfo);
  }, [selectedModel]);

  useEffect(() => {
    const bPrice = calculateBasePrice(selectedProductInfo, selectedIndex);
    setBasePrice(bPrice);
  }, [selectedModel, selectedIndex]);

  const handleSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSelectedModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleSelectedIndex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIndex(e.target.value);
  };

  return (
    <form className="text-black flex flex-col">
      <label>
        Select Product Category
        <select onChange={handleSelectedCategory}>
          {productCategories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        Select Product
        <select onChange={handleSelectedModel}>
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
        <select onChange={handleSelectedIndex}>
          {productIndexes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <div className="flex">
        <p>Base Price</p>
        <p>{isNaN(basePrice) ? "unavailable" : `$${basePrice}`}</p>
      </div>
      <div className="flex">
        <p>Family Plan Eligible</p>
        <p>{selectedProductInfo?.familyPlanEligible ? "Y" : "N"}</p>
      </div>
    </form>
  );
};

export default FrameForm;
