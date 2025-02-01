import { usePricingContext } from "@/lib/context/PricingContext";

type discountFormProps = {
  labelsArray: string[];
};

const DiscountForm: React.FC<discountFormProps> = () => {
  const pricingTool = usePricingContext();

  const { availableDiscounts, discountSelected, setDiscountSelected } =
    pricingTool;

  console.log(discountSelected);
  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    /** discount = {
    * name:'BOGO',
    * conditionMET: FALSE,
    * errorMessage: '',
   } */
    // Find the corresponding discount object in discountSelected
    const existingDiscountIndex = discountSelected.findIndex(
      (discount) => discount.name === value
    );

    // Update discountSelected based on checkbox selection
    setDiscountSelected((prevDiscountSelected) => {
      if (existingDiscountIndex !== -1) {
        // Discount already selected, remove it
        return prevDiscountSelected.filter(
          (discount) => discount.name !== value
        );
      } else {
        // Discount not selected, add it with initial conditions
        return [...prevDiscountSelected, { name: value, conditionMet: false }];
      }
    });
  };

  const handleApplyDiscounts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target);
  };
  return (
    <div className="flex flex-col">
      <form onSubmit={handleApplyDiscounts}>
        {availableDiscounts.map((discount, i) => {
          //console.log(discount);
          const { name, conditionLabel } = discount;
          return (
            <div key={i}>
              <label>
                <input type="checkbox" value={name} onChange={handleCheckBox} />
                {name}
              </label>
              <div>
                {discountSelected.findIndex(
                  (discount) => discount.name === name
                ) !== -1 && (
                  <div>
                    <label>
                      <input type="checkbox" />
                      {conditionLabel}
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <button type="submit" className="bg-lime-500 font-bold p-2 rounded">
          {" "}
          Apply Discount
        </button>
      </form>
    </div>
  );
};

export default DiscountForm;
