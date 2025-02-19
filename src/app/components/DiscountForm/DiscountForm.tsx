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
  } = discountTool;

  //console.log("discountSelected before render", discountSelected);

  useEffect(() => {
    isDiscountApplicable(cart, discountSelected);
  }, [cart]);

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
          //console.log("discountSelected inside map", discountSelected);
          return (
            <div key={id}>
              <label>
                <input type="checkbox" value={id} onChange={handleCheckBox} />
                {name}
              </label>
              <div>
                {discountSelected?.findIndex(
                  (discount) => discount.id === id
                ) !== -1 && (
                  <div key={id}>
                    {checkboxConditions
                      ? checkboxConditions.map((cond) => {
                          return (
                            <label key={cond.id}>
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
                      return (
                        <p key={cond.id} className="text-red-500">
                          {cond.errorMessage}
                        </p>
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
