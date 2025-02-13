"use client";

import { usePricingContext } from "@/lib/context/PricingContext";
import { useEffect } from "react";
import internal from "stream";

type discountFormProps = {
  labelsArray: string[];
};

const DiscountForm: React.FC<discountFormProps> = () => {
  const pricingTool = usePricingContext();

  const {
    cart,
    availableDiscounts,
    discountSelected,
    setDiscountSelected,
    isDiscountApplicable,
    isCombinable,
    discountErrors,
    setDiscountErrors,
  } = pricingTool;

  useEffect(() => {
    isDiscountApplicable(discountSelected);
    //console.log("discountSelected", discountSelected);
    // if (discountSelected.length > 1) {
    //   discountSelected.forEach((discount) => {
    //     const { internalConditions } = discount;
    //     internalConditions.forEach((cond) => {
    //       setDiscountErrors((prev) => [...prev, cond.errorMessage]);
    //     });
    //   });
    // }
  }, [discountSelected, cart]);

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Find the corresponding discount object in discountSelected
    const existingDiscountIndex = discountSelected.findIndex(
      (discount) => discount.id === value
    );

    // Update discountSelected based on checkbox selection
    setDiscountSelected((prevDiscountSelected) => {
      if (existingDiscountIndex !== -1) {
        // Discount already selected, remove it
        return prevDiscountSelected.filter((discount) => discount.id !== value);
      } else {
        // Discount not selected, add it with initial conditions
        const selectedDiscount = availableDiscounts.find(
          (discount) => discount.id === value
        );
        return [...prevDiscountSelected, selectedDiscount];
      }
    });
  };

  const handleConditionCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>,
    discountID: string
  ) => {
    const { checked, value: conditionID } = e.target;

    setDiscountSelected((prevDiscountSelected) => {
      return prevDiscountSelected.map((discount) => {
        if (discount.id === discountID) {
          const { checkboxConditions } = discount;
          return {
            ...discount,
            checkboxConditions: checkboxConditions.map((cond) => {
              if (cond.id === conditionID) {
                return { ...cond, conditionMet: checked };
              } else {
                return cond;
              }
            }),
          };
        } else {
          return discount;
        }
      });
    });
  };

  const handleApplyDiscounts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleApplyDiscounts}>
        {availableDiscounts.map((discount, i) => {
          const { id, name, checkboxConditions, internalConditions } = discount;
          return (
            <div key={id}>
              <label>
                <input type="checkbox" value={id} onChange={handleCheckBox} />
                {name}
              </label>
              <div>
                {discountSelected.findIndex(
                  (discount) => discount.id === id
                ) !== -1 && (
                  <div key={id}>
                    {checkboxConditions
                      ? checkboxConditions.map((cond) => {
                          return (
                            <label>
                              <input
                                type="checkbox"
                                name="checkboxCondition"
                                value={cond.id}
                                onChange={(e) => handleConditionCheckBox(e, id)}
                              />
                              {cond.label}
                            </label>
                          );
                        })
                      : null}
                  </div>
                )}
              </div>
              {/* error msg condition specific*/}
              <div>
                {internalConditions
                  ? internalConditions.map((cond) => {
                      //console.log("internalConditions, error?", cond);
                      return (
                        <p className="text-red-500">{cond.errorMessage}</p>
                      );
                    })
                  : null}
              </div>
            </div>
          );
        })}
        <button type="submit" className="bg-lime-500 font-bold p-2 rounded">
          Apply Discount
        </button>
      </form>
    </div>
  );
};

export default DiscountForm;
