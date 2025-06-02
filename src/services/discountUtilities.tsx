import crypto from "crypto";
import { selectedProductType } from "@/app/_types/ProductTypes";
import {
  DiscountItemType,
  DISCOUNT_CONDITIONS,
} from "@/app/_types/DiscountTypes";

type RawDiscountRow = string[];
interface ParsedCheckboxCondition {
  id: string;
  label: string;
  conditionMet: boolean;
  errorMessage: string;
}

interface ParsedInternalCondition {
  id: string;
  condition: string;
  requiredValue: string | boolean | number;
  conditionMet: boolean;
  errorMessage?: string;
}

interface ConditionCheckResult {
  conditionMet: boolean;
  errorMessage: string;
}

function generateConsistentId(baseId: string, prefix: string = "cond") {
  const hash = crypto
    .createHash("md5")
    .update(baseId)
    .digest("hex")
    .slice(0, 8);
  return `${prefix}-${hash}`;
}

//isolate and organize discount information into object
export function organizeDiscountInfo(
  data: string[]
): DiscountItemType[] | string {
  if (!Array.isArray(data) || data.length === 0) {
    return "Invalid input: Data must be a non-empty array.";
  }

  const headers = data[0];
  const discountsInfo: DiscountItemType[] = [];

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
      if (header === "applyToNth" && typeof value === "string") {
        discountObject[header] = Number(value);
      } else if (header === "checkboxConditions" && typeof value === "string") {
        discountObject[header] = value.split(",").map((cond) => {
          const conditionID = generateConsistentId(cond.trim(), "cbx");
          return {
            id: conditionID,
            label: cond.trim(),
            conditionMet: false,
            errorMessage:
              "Please ensure checkbox condition and check the checkbox",
          };
        });
      } else if (header in DISCOUNT_CONDITIONS) {
        discountObject["internalConditions"] =
          discountObject["internalConditions"] || []; // Ensure array exists
        const conditionID = generateConsistentId(header, "int");
        discountObject["internalConditions"].push({
          id: conditionID,
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
      if (!product.familyPlanEligible) {
        notEligibleProduct += `${product.category} ${product.model}`;
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
  discountSelected: DiscountItemType[],
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

export function verifyCheckBoxConditions(discountSelected) {
  let allCheckboxChecked = true;

  discountSelected.forEach((discount) => {
    const { checkboxConditions } = discount;
    checkboxConditions.forEach((cond) => {
      if (!cond.conditionMet) {
        allCheckboxChecked = false;
      } else {
        return;
      }
    });
  });
  return allCheckboxChecked;
}

export function verifyInternalConditions(discountSelected) {
  let allInternalConditionsMet = true;

  discountSelected.forEach((discount) => {
    if (!discount.allInternalConditionsMet) {
      allInternalConditionsMet = false;
    }
  });
  return allInternalConditionsMet;
}

export function getPrice(product, productType) {
  const priceMap = {
    frame: product.framePrice,
    lens: product.lensSubTotal,
    set: product.total,
  };

  return priceMap[productType] ?? 0; // Default to 0 if productType is invalid
}
export function getNthSmallestPrices(cart, productType, applyToNth = 1) {
  if (cart.length === 0) return [];

  const sortedProducts = cart
    .map((product) => ({
      productID: product.id,
      priceType: productType,
      price: getPrice(product, productType),
    }))
    .sort((a, b) => a.price - b.price); // Sort by price (ascending)

  const smallestProducts = [];
  let applyToNthNumber = applyToNth;
  if (applyToNth >= 2 && cart.length < 3) {
    applyToNthNumber = 1;
  }
  for (let i = 0; i < applyToNthNumber; i++) {
    const smallestProduct = cart.find(
      (product) => product.id === sortedProducts[i].productID
    );
    smallestProducts.push(smallestProduct);
  }
  return smallestProducts;
}

export function calculateDiscountedPrice(
  product: selectedProductType,
  applyToProduct: string,
  discountType: string,
  discountValue: string
) {
  console.log("calculating", product);
  const { id, pairNumber } = product;
  //determine discountType: free item, percentage, amount off
  //get the corresponding price as per applyToProduct
  let originalPrice = 0;

  // Determine the original price based on `applyToProduct`
  switch (applyToProduct) {
    case "frame":
      originalPrice = product.framePrice;
      break;
    case "lens":
      originalPrice = product.lensSubTotal;
      break;
    case "set":
      originalPrice = product.total;
      break;
    default:
      console.warn("Invalid applyToProduct value:", applyToProduct);
      return { discountedPrice: 0, discountAmount: 0 };
  }

  let discountAmount = 0;
  let discountedPrice = originalPrice;

  if (!originalPrice || isNaN(originalPrice))
    return { discountedPrice, discountAmount };

  // Apply discount based on discountType
  switch (discountType) {
    case "free":
      discountAmount = originalPrice;
      discountedPrice = 0;
      break;

    case "percentage":
      discountAmount = (originalPrice * Number(discountValue)) / 100;
      discountedPrice = originalPrice - discountAmount;
      break;

    case "amountOff":
      discountAmount = Number(discountValue);
      discountedPrice = Math.max(originalPrice - discountAmount, 0); // Prevent negative price
      break;

    default:
      console.warn("Invalid discount type:", discountType);
  }

  return { discountedPrice, discountAmount, applyToProduct, pairNumber, id };
}
