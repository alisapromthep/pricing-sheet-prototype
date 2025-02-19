import { ProductItem } from "@/lib/ProductItem";
import { selectedProductType } from "@/app/_types/ProductTypes";
import {
  DiscountDataType,
  DiscountItemType,
  DISCOUNT_CONDITIONS,
} from "@/app/_types/DiscountTypes";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId();

//isolate and organize discount information into object
export function organizeDiscountInfo(
  data: string[]
): DiscountItemType[] | string {
  if (!Array.isArray(data) || data.length === 0) {
    return "Invalid input: Data must be a non-empty array.";
  }

  const headers = data[0];
  const discountsInfo: any[] = [];

  for (let i = 1; i < data.length; i++) {
    const rowData = data[i];
    const discountObject: any = {};

    if (headers.length !== rowData.length) {
      return "Headers and row data must have the same length";
    }

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].trim();
      let value: string | boolean = rowData[j].trim();

      switch (value) {
        case "TRUE":
          value = true;
          break;
        case "FALSE":
          value = false;
          break;
      }
      if (header === "applyToProduct" && typeof value === "string") {
        const arrProducts = value.split(",").map((product) => product.trim());
        discountObject[header] = arrProducts;
      } else if (header === "checkboxConditions" && typeof value === "string") {
        discountObject[header] = value.split(",").map((cond) => {
          return {
            id: uid.rnd(),
            label: cond.trim(),
            conditionMet: false,
            errorMessage:
              "Please ensure checkbox condition and check the checkbox",
          };
        });
      } else if (header in DISCOUNT_CONDITIONS) {
        discountObject["internalConditions"] =
          discountObject["internalConditions"] || []; // Ensure array exists
        discountObject["internalConditions"].push({
          id: uid.rnd(),
          condition: header, // Use the header as the condition name
          requiredValue: value,
          conditionMet: false,
        });
      } else {
        discountObject[header] = value;
      }
    }
    discountsInfo.push(discountObject);
  }
  return discountsInfo;
}
export function checkMinPurchase(
  cart: selectedProductType[],
  condition: { [key: string]: any }
) {
  if (cart.length < (condition.requiredValue || 0)) {
    return {
      conditionMet: false,
      errorMessage: `Minimum purchase required: ${condition.requiredValue} items.`,
    };
  } else {
    return { conditionMet: true, errorMessage: "" };
  }
}

export function checkFamilyPlanEligibility(
  cart: selectedProductType[],
  condition: { [key: string]: any }
) {
  let allFamilyEligible = true;
  let notEligibleProduct: string = "";
  if (condition.requiredValue) {
    cart.forEach((product) => {
      const { selectedProductItem: item } = product;
      if (!item.familyPlanEligible) {
        notEligibleProduct += `${item.category} ${item.model}`;
        allFamilyEligible = false;
      }
    });
    if (!allFamilyEligible) {
      return {
        conditionMet: true,
        errorMessage: `${notEligibleProduct} is not eligible for family plan discount`,
      };
    } else {
      return { conditionMet: true, errorMessage: "" };
    }
  } else {
    return { conditionMet: true, errorMessage: "" };
  }
}

export function checkCanCombine(
  discountSelected: DiscountInfoType[],
  condition: { [key: string]: any }
) {
  if (discountSelected.length > 1 && !condition.requiredValue) {
    return {
      conditionMet: false,
      errorMessage: `This discount cannot be combine with other discount`,
    };
  } else {
    return { conditionMet: true, errorMessage: "" };
  }
}
