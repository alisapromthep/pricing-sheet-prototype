import { usePricingContext } from "@/lib/context/PricingContext";

type discountFormProps = {
  labelsArray: string[];
};

const DiscountForm: React.FC<discountFormProps> = () => {
  const pricingTool = usePricingContext();

  const {
    availableDiscounts,
    discountSelected,
    setDiscountSelected,
    isDiscountApplicable,
  } = pricingTool;

  //console.log("available discount", availableDiscounts);

  //console.log(discountSelected);
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
    discountName: string
  ) => {
    console.log("handleCheckbx");
    // const { checked, value: conditionName } = e.target;

    // setDiscountSelected((prevDiscountSelected) => {
    //   return prevDiscountSelected.map((discount) => {
    //     if (discount.name === discountName) {
    //       return {
    //         ...discount,
    //         discountConditions: discount.discountConditions.map((cond) => {
    //           if (cond[conditionName]) {
    //             return {
    //               ...cond,
    //               [conditionName]: {
    //                 ...cond[conditionName],
    //                 conditionMet: checked,
    //               },
    //             };
    //           }
    //           return cond;
    //         }),
    //       };
    //     }
    //     return discount;
    //   });
    // });
  };

  const handleApplyDiscounts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handleApplyDiscounts");
    //isDiscountApplicable(discountSelected);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleApplyDiscounts}>
        {availableDiscounts.map((discount, i) => {
          console.log(discount);
          const { id, name, checkboxConditions } = discount;

          return (
            <div key={id}>
              <label>
                <input type="checkbox" value={id} onChange={handleCheckBox} />
                {name}
              </label>
              <div>
                {discountSelected.findIndex(
                  (discount) => discount.name === name
                ) !== -1 && (
                  <div key={id}>
                    {checkboxConditions
                      ? checkboxConditions.map((cond) => {
                          return (
                            <label>
                              <input
                                type="checkbox"
                                name="checkboxCondition"
                                value={cond.label}
                                onChange={() => {}}
                              />
                              {cond.label}
                            </label>
                          );
                        })
                      : null}
                  </div>
                )}
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
