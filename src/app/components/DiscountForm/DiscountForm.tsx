"use client";

import { usePricingContext } from "@/lib/context/PricingContext";
import { useEffect } from "react";
import { useDiscountContext } from "@/lib/context/DiscountContext";

const DiscountForm: React.FC = () => {
  const pricingTool = usePricingContext();
  const discountTool = useDiscountContext();
  const { cart } = pricingTool;

  const {
    availableDiscounts,
    discountSelected,
    setDiscountSelected,
    isDiscountApplicable,
    applyDiscount,
  } = discountTool;

  //console.log("discountSelected before render", discountSelected);

  useEffect(() => {
    isDiscountApplicable(cart, discountSelected);
  }, [discountSelected, cart]);

  useEffect(() => {
    console.log("Updated discountSelected:", discountSelected);
  }, [discountSelected]);

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const doesExists = discountSelected.findIndex(
      (discount) => discount.id === value
    );

    // Update discountSelected based on checkbox selection

    setDiscountSelected((prevSelected) => {
      if (doesExists !== -1) {
        const updatedSelection = prevSelected.filter(
          (discount) => discount.id !== value
        );

        return [...updatedSelection];
      } else {
        //add discount to it
        const newSelection = availableDiscounts.find(
          (discount) => discount.id === value
        );

        return [...prevSelected, newSelection];
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
                return {
                  ...cond,
                  conditionMet: checked,
                  errorMessage: checked
                    ? ""
                    : "Please ensure checkbox condition",
                };
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
    applyDiscount(cart, discountSelected);
  };
  return (
    <div className="flex flex-col">
      <form onSubmit={handleApplyDiscounts}>
        {availableDiscounts.map((discount) => {
          const { id, name, checkboxConditions, internalConditions } = discount;

          // Find the selected discount
          const selectedDiscount = discountSelected.find((d) => d.id === id);

          return (
            <div key={id}>
              {/* Main Checkbox */}
              <label>
                <input type="checkbox" value={id} onChange={handleCheckBox} />
                {name}
              </label>
              {/* Show Checkbox Conditions if Selected */}
              {selectedDiscount && checkboxConditions && (
                <div>
                  {checkboxConditions.map((cond) => (
                    <label key={cond.id}>
                      <input
                        type="checkbox"
                        name="checkboxCondition"
                        value={cond.id}
                        onChange={(e) => handleConditionCheckBox(e, id)}
                      />
                      {cond.label}
                    </label>
                  ))}
                </div>
              )}
              {selectedDiscount && (
                <div>
                  {/* Checkbox Condition Errors */}
                  {selectedDiscount.checkboxConditions?.map((cond) =>
                    cond.errorMessage ? (
                      <p key={cond.id} className="text-red-500">
                        {cond.errorMessage}
                      </p>
                    ) : null
                  )}

                  {/* Internal Condition Errors */}
                  {selectedDiscount.internalConditions?.map((cond) =>
                    cond.errorMessage ? (
                      <p key={cond.id} className="text-red-500">
                        {cond.errorMessage}
                      </p>
                    ) : null
                  )}
                </div>
              )}
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
