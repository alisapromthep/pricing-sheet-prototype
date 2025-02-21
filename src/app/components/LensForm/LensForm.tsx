"use client";

import { useEffect, useState } from "react";
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

interface LensFormProps {
  formID: string;
}

//TODO: optimize, currently it re-render 20+ times to populated

const LensForm: React.FC<LensFormProps> = ({ formID }) => {
  const data = useGoogleSheetsContext();

  const pricingTool = usePricingContext();
  const { cart, updateProduct } = pricingTool;
  //console.log("cart", cart);

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
      id: "",
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

  //TODO: move the setting of initial product information into context
  /**
   * createProduct should fill in these initial info
   * And the new product is use to fill the form initially
   * then these information is use for the rest, taking the states out of this file
   * helps with clean up button as well
   */

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
    updateProduct({ selectedProductItem: productInfo }, formID);
  }, [selectedModel]);

  useEffect(() => {
    const bPrice = calculateBasePrice(selectedProductInfo, selectedIndex);
    setBasePrice(bPrice);
    updateProduct({ indexPrice: bPrice }, formID);
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
      <label className="my-1 flex justify-between">
        Select Lens Category
        <select
          onChange={handleSelectedCategory}
          className="mx-2 px-4 py-2 pr-8 bg-gray-100 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline
          "
        >
          {lensCategories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="my-1 flex justify-between">
        Select Product
        <select
          onChange={handleSelectedModel}
          className="mx-2 px-4 py-2 pr-8 bg-gray-100 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline
          "
        >
          {productList &&
            productList.map((product, i) => (
              <option key={i} value={product.model}>
                {product.model}
              </option>
            ))}
        </select>
      </label>
      <label className="my-1 flex justify-between">
        Select Index
        <select
          onChange={handleSelectedIndex}
          className="mx-2 px-4 py-2 pr-8 bg-gray-100 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline
          "
        >
          {productIndexes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <div className="my-1 flex items-center justify-between">
        <p>Base Price</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {isNaN(basePrice) ? "unavailable" : `$${basePrice}`}
        </p>
      </div>
      <div className="my-1 flex items-center justify-between">
        <p>Family Plan Eligible</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {selectedProductInfo?.familyPlanEligible ? "Y" : "N"}
        </p>
      </div>
    </div>
  );
};

export default LensForm;
