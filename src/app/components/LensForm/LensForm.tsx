"use client";

import { useEffect, useState } from "react";
import { useProductState } from "@/lib/useProductState";
import {
  fetchProductTypes,
  fetchProductListInfo,
  fetchSelectedProductInfo,
  calculateBasePrice,
  fetchProductIndexes,
  fetchCategoriesList,
  fillInProductCategories,
} from "@/services/organizeData";
import { useGoogleSheetsContext } from "@/lib/context/GoogleSheetsContext";
import { PricesType, ProductItemsType } from "@/app/_types/ProductTypes";
import { usePricingContext } from "@/lib/context/PricingContext";

type CategoryMap = { [category: string]: string[] };

const LensForm: React.FC = () => {
  const data = useGoogleSheetsContext();

  const pricingTool = usePricingContext();
  const { currentProduct, setCurrentProduct, updateProduct } = pricingTool;

  const { sheetsData, loading, error } = data || {};
  const { lens } = sheetsData;

  const [lensCategories, setLensCategories] = useState<string[]>([]);
  const [productIndexes, setProductIndexes] = useState([]);
  const [productListByCategory, setProductListByCategory] = useState({});
  const [productList, setProductList] = useState<ProductItemsType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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
    //getting all the lens products from sheetData
    //then getting the indexes and productlist
    if (sheetsData) {
      const lensType = fetchProductTypes(lens);
      if (lensType && lensType.length > 0) {
        setLensCategories(lensType);
        setSelectedCategory(lensType[0]);
        const indexes = fetchProductIndexes(lens[0]);
        setProductIndexes(indexes);
        //get the list of product by categories
        const listByCategory = fetchCategoriesList(lens);

        //fill each categories with the products
        fillInProductCategories(lens, listByCategory, indexes);
        setProductListByCategory(listByCategory);
      }
    }
  }, [sheetsData]);

  useEffect(() => {
    // Fetch the product list for the initially selected type
    const initialProductList = productListByCategory[selectedCategory];
    if (initialProductList) {
      setProductList(initialProductList);
      setSelectedProductInfo(initialProductList[0]);
      setSelectedModel(initialProductList[0].model);
      setSelectedIndex(productIndexes[0]);
    }
  }, [selectedCategory, productListByCategory]);

  useEffect(() => {
    const productInfo = fetchSelectedProductInfo(productList, selectedModel);
    setSelectedProductInfo(productInfo);
    updateProduct({ selectedProductItem: productInfo });
  }, [selectedModel]);

  useEffect(() => {
    const bPrice = calculateBasePrice(selectedProductInfo, selectedIndex);
    setBasePrice(bPrice);
    updateProduct({ indexPrice: bPrice });
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

  if (loading || error || !sheetsData) {
    return <p>loading...</p>;
  }

  return (
    <div className="text-black flex flex-col">
      <label>
        Select Lens Category
        <select onChange={handleSelectedCategory}>
          {lensCategories.map((category, i) => (
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
    </div>
  );
};

export default LensForm;
