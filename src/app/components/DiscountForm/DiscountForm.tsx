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
    discountErrors,
    applyDiscount,
  } = discountTool;

  useEffect(() => {
    const savedDiscount = localStorage.getItem("discount");
    if (savedDiscount) {
      const parsedSavedDiscount = JSON.parse(savedDiscount);
      setDiscountSelected([...parsedSavedDiscount]);
    }
  }, [setDiscountSelected]);

  useEffect(() => {
    isDiscountApplicable(cart, discountSelected);
  }, [discountSelected, cart]);

  useEffect(() => {
    localStorage.setItem("discount", JSON.stringify(discountSelected));
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
        if (newSelection) {
          return [...prevSelected, newSelection];
        }
        return prevSelected;
      }
    });
  };

  const handleConditionCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>,
    discountID: string
  ) => {
    const { checked, value: conditionID } = e.target;

    // setDiscountSelected((prevSelected) => {
    //   const value = e.target.value;
    //   const doesExists = prevSelected.findIndex(
    //     (discount) => discount.id === value
    //   );

    //   if (doesExists !== -1) {
    //     const updatedSelection = prevSelected.filter(
    //       (discount) => discount.id !== value
    //     );
    //     return updatedSelection;
    //   } else {
    //     const newDiscountToAdd = availableDiscounts.find(
    //       (discount) => discount.id === value
    //     );

    //     if (newDiscountToAdd) {
    //       return [...prevSelected, newDiscountToAdd];
    //     } else {
    //       console.warn(`Attempted to add unknown discount with ID: ${value}`);
    //       return prevSelected;
    //     }
    //   }
    // });

    setDiscountSelected((prevDiscountSelected) => {
      return prevDiscountSelected.map((discount) => {
        if (discount.id === discountID) {
          const updatedConditions = discount.checkboxConditions.map((cond) =>
            cond.id === conditionID
              ? {
                  ...cond,
                  conditionMet: checked,
                  errorMessage: checked
                    ? ""
                    : "Please ensure checkbox condition",
                }
              : cond
          );
          return { ...discount, checkboxConditions: updatedConditions };
        }
        return discount;
      });
    });
  };

  const handleApplyDiscounts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyDiscount(cart, discountSelected);
  };
  return (
    <div id="discount-section" className="text-sm md:text-base flex flex-col">
      <form onSubmit={handleApplyDiscounts}>
        {availableDiscounts.map((discount) => {
          const { id, name, checkboxConditions, internalConditions } = discount;

          const isChecked = discountSelected.some(
            (discount) => discount.id === id
          );
          // Find the selected discount
          const selectedDiscount = discountSelected.find(
            (discount) => discount.id === id
          );

          return (
            <div key={id}>
              {/* Main Checkbox */}
              <label>
                <input
                  type="checkbox"
                  value={id}
                  onChange={handleCheckBox}
                  checked={isChecked}
                />
                {name}
              </label>
              {/* Show Checkbox Conditions if Selected */}
              <div className="ml-4">
                {isChecked && checkboxConditions && (
                  <div>
                    {checkboxConditions.map((cond) => {
                      const isConditionChecked =
                        selectedDiscount?.checkboxConditions
                          ? selectedDiscount.checkboxConditions.some((c) => {
                              return c.id === cond.id && c.conditionMet;
                            })
                          : false;
                      return (
                        <label key={cond.id}>
                          <input
                            type="checkbox"
                            name="checkboxCondition"
                            value={cond.id}
                            onChange={(e) => handleConditionCheckBox(e, id)}
                            checked={isConditionChecked}
                          />
                          {cond.label}
                        </label>
                      );
                    })}
                  </div>
                )}
                {isChecked && checkboxConditions && (
                  <div>
                    {/* Checkbox Condition Errors */}
                    {selectedDiscount?.checkboxConditions?.map((cond) =>
                      cond.errorMessage ? (
                        <p key={cond.id} className="text-red-500">
                          {cond.errorMessage}
                        </p>
                      ) : null
                    )}

                    {/* Internal Condition Errors */}
                    {selectedDiscount?.internalConditions?.map((cond) =>
                      cond.errorMessage ? (
                        <p key={cond.id} className="text-red-500">
                          {cond.errorMessage}
                        </p>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <button type="submit" className="bg-emerald-300 font-bold p-2 rounded">
          Apply Discount
        </button>
        <div>
          {discountErrors && <p className="text-red-500">{discountErrors}</p>}
        </div>
      </form>
    </div>
  );
};

export default DiscountForm;
