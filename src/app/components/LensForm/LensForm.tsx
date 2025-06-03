"use client";

import { useEffect, useState } from "react";
import {
  getProductTypes,
  getSelectedProductInfo,
  getProductIndexes,
  getCategoriesList,
  fillInProductCategories,
  getLensBasePrice,
} from "@/services/organizeData";
import { useGoogleSheetsContext } from "@/lib/context/GoogleSheetsContext";
import {
  ProductItemsType,
  selectedProductType,
} from "@/app/_types/ProductTypes";
import { usePricingContext } from "@/lib/context/PricingContext";

interface LensFormProps {
  formID: string;
}

interface currentFormType {
  id: string;
  addOnPrice: number;
  category: string;
  discounted: boolean;
  familyPlanEligible: boolean;
  framePrice: number;
  index: string;
  lensBasePrice: number;
  lensSubTotal: number;
  lensTreatment: [];
  lensTreatmentPrice: number;
  model: string;
  pairNumber: number;
  productInfo: ProductItemsType;
  selectedIndex: string;
  productList: ProductItemsType[];
  total: number;
}

//TODO: optimize, currently it re-render 20+ times to populated

const LensForm: React.FC<LensFormProps> = ({ formID }) => {
  const data = useGoogleSheetsContext();
  const pricingTool = usePricingContext();

  const { cart, updateProduct, updateLensBasePrice } = pricingTool;

  const defaultProductItem: ProductItemsType = {
    id: "",
    category: "",
    model: "",
    familyPlanEligible: false,
    prices: {},
  };

  const defaultCurrentForm: currentFormType = {
    id: "",
    addOnPrice: 0,
    category: "",
    discounted: false,
    familyPlanEligible: false,
    framePrice: 0,
    index: "",
    lensBasePrice: 0,
    lensSubTotal: 0,
    lensTreatment: [],
    lensTreatmentPrice: 0,
    model: "",
    pairNumber: 0,
    productInfo: defaultProductItem,
    selectedIndex: "",
    productList: [defaultProductItem],
    total: 0,
  };

  const currentForm =
    cart.find((form) => form.id === formID) || defaultCurrentForm;

  const { sheetsData, loading, error } = data || {
    sheetsData: {},
    loading: true,
    error: null,
  };
  const { lens = [] } = sheetsData;

  // const { sheetsData, loading, error } = data || {};
  // const { lens } = sheetsData;

  const [formOptions, setFormOptions] = useState({
    lensCategories: [] as string[],
    productListByCategory: {} as Record<string, ProductItemsType[]>,
    productIndexes: [] as string[] | undefined,
    productList: [] as ProductItemsType[],
  });

  useEffect(() => {
    //getting all the lens products from sheetData
    //then getting the indexes and productlist
    if (sheetsData) {
      const lensType = getProductTypes(lens);

      if (lensType && lensType.length > 0) {
        //setLensCategories(lensType);
        const lensCategories = lensType;
        const selectedCategory = currentForm?.category || lensType[0];
        //setSelectedCategory(selectedCategory);

        const productIndexes = getProductIndexes(lens[0]);
        //setProductIndexes(productIndexes);

        //get the list of product by categories
        const productListByCategory = getCategoriesList(lens);

        //fill each categories with the products
        fillInProductCategories(lens, productListByCategory, productIndexes);

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
      formOptions.productListByCategory[currentForm?.category];

    if (initialProductList) {
      setFormOptions((prev) => ({ ...prev, productList: initialProductList }));
      const initialInfo = {
        productInfo: currentForm?.productInfo || initialProductList[0],
        model: currentForm?.model || initialProductList[0].model,
        index: currentForm?.selectedIndex || formOptions.productIndexes?.[0],
        lensBasePrice:
          currentForm?.lensBasePrice ||
          getLensBasePrice(
            initialProductList[0],
            formOptions.productIndexes?.[0] ?? ""
          ),
      };
      updateProduct(initialInfo, formID);
    }
  }, [currentForm?.category, formOptions.productListByCategory]);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    const value = e.target.value;

    const updates: Record<string, any> = { [field]: value };

    if (field === "index") {
      updates.lensBasePrice = getLensBasePrice(currentForm.productInfo, value);
    } else if (field === "category") {
      updates.productList = formOptions.productListByCategory[value];

      updateLensBasePrice(
        formOptions.productListByCategory,
        value,
        currentForm.model,
        currentForm.index,
        formID
      );
    } else if (field === "model") {
      const productInfo = getSelectedProductInfo(
        currentForm.productList,
        value
      );
      updates.familyPlanEligible = productInfo?.familyPlanEligible;

      updateLensBasePrice(
        formOptions.productListByCategory,
        currentForm.category,
        value,
        currentForm.index,
        formID
      );
    }

    updateProduct(updates, formID);
  };

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
          className="mx-2 px-4 py-2 pr-8 border border-rv-navy hover:bg-sky-50  rounded shadow leading-tight focus:outline-none focus:shadow-outline
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
          className="mx-2 px-4 py-2 pr-8 border border-rv-navy hover:bg-sky-50  rounded shadow leading-tight focus:outline-none focus:shadow-outline
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
          className="mx-2 px-4 py-2 pr-8  border border-rv-navy hover:bg-sky-50  rounded shadow leading-tight focus:outline-none focus:shadow-outline
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
          {isNaN(currentForm.lensBasePrice)
            ? "unavailable"
            : `$${currentForm.lensBasePrice}`}
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
