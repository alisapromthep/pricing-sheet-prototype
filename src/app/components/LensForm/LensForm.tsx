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

interface LensFormProps {
  formID: string;
}

//TODO: optimize, currently it re-render 20+ times to populated

const LensForm: React.FC<LensFormProps> = ({ formID }) => {
  const data = useGoogleSheetsContext();
  const pricingTool = usePricingContext();

  const { cart, updateProduct } = pricingTool;

  const currentForm = cart.find((form) => form.id === formID);

  const { sheetsData, loading, error } = data || {};
  const { lens } = sheetsData;

  const [formOptions, setFormOptions] = useState({
    lensCategories: [] as string[],
    productListByCategory: {} as Record<string, ProductItemsType[]>,
    productIndexes: [] as string[],
    productList: [] as ProductItemsType[],
  });

  useEffect(() => {
    //getting all the lens products from sheetData
    //then getting the indexes and productlist
    if (sheetsData) {
      const lensType = fetchProductTypes(lens);

      if (lensType && lensType.length > 0) {
        //setLensCategories(lensType);
        const lensCategories = lensType;
        const selectedCategory = currentForm.category || lensType[0];
        //setSelectedCategory(selectedCategory);

        const productIndexes = fetchProductIndexes(lens[0]);
        //setProductIndexes(productIndexes);

        //get the list of product by categories
        const productListByCategory = fetchCategoriesList(lens);

        //fill each categories with the products
        fillInProductCategories(lens, productListByCategory, productIndexes);
        //setProductListByCategory(productListByCategory);
        console.log("productListByCategory", productListByCategory);

        setFormOptions({
          lensCategories,
          productListByCategory,
          productIndexes,
          productList: [],
        });

        updateProduct({ category: selectedCategory }, formID);
      }
    }
  }, [sheetsData]);

  useEffect(() => {
    // Fetch the product list for the initially selected type
    //const initialProductList = productListByCategory[selectedCategory];

    const initialProductList =
      formOptions.productListByCategory[currentForm.category];

    if (initialProductList) {
      setFormOptions((prev) => ({ ...prev, productList: initialProductList }));
      const initialInfo = {
        productInfo: currentForm.productInfo || initialProductList[0],
        model: currentForm.model || initialProductList[0].model,
        index: currentForm.selectedIndex || formOptions.productIndexes[0],
      };
      updateProduct(initialInfo, formID);
    }
  }, [currentForm.category, formOptions.productListByCategory]);

  useEffect(() => {
    const productInfo = fetchSelectedProductInfo(
      formOptions.productList,
      currentForm.model
    );

    console.log("productInfo", productInfo);
    if (productInfo) {
      updateProduct(
        { familyPlanEligible: productInfo.familyPlanEligible },
        formID
      );
    }
  }, [currentForm.model]);

  const handleSelectChange = (e, field) => {
    if (field === "index") {
      const bPrice = calculateBasePrice(
        currentForm.productInfo,
        currentForm.index
      );
      const updateIndex = {
        selectedIndex: e.target.value,
        indexPrice: bPrice,
      };
      updateProduct(updateIndex, formID);
    } else {
      updateProduct(
        {
          [field]: e.target.value,
        },
        formID
      );
    }
  };

  //console.log("currentForm", currentForm);

  if (loading || error || !sheetsData) {
    return <p>loading...</p>;
  }

  return (
    <div className="text-black flex flex-col">
      <label className="my-1 flex justify-between">
        Select Lens Category
        <select
          value={currentForm.category}
          onChange={(e) => handleSelectChange(e, "category")}
          className="mx-2 px-4 py-2 pr-8 bg-gray-100 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline
          "
        >
          {formOptions.lensCategories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="my-1 flex justify-between">
        Select Product
        <select
          value={currentForm.model}
          onChange={(e) => handleSelectChange(e, "model")}
          className="mx-2 px-4 py-2 pr-8 bg-gray-100 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline
          "
        >
          {formOptions.productList &&
            formOptions.productList.map((product, i) => (
              <option key={i} value={product.model}>
                {product.model}
              </option>
            ))}
        </select>
      </label>
      <label className="my-1 flex justify-between">
        Select Index
        <select
          value={currentForm.selectedIndex}
          onChange={(e) => handleSelectChange(e, "index")}
          className="mx-2 px-4 py-2 pr-8 bg-gray-100 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline
          "
        >
          {formOptions.productIndexes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <div className="my-1 flex items-center justify-between">
        <p>Base Price</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {isNaN(currentForm.indexPrice)
            ? "unavailable"
            : `$${currentForm.indexPrice}`}
        </p>
      </div>
      <div className="my-1 flex items-center justify-between">
        <p>Family Plan Eligible</p>
        <p className="mx-2 px-4 py-2 pr-8">
          {currentForm.familyPlanEligible ? "Y" : "N"}
        </p>
      </div>
    </div>
  );
};

export default LensForm;
