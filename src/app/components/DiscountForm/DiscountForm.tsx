import { usePricingContext } from "@/lib/context/PricingContext";

type discountFormProps = {
  labelsArray: string[];
};

const DiscountForm: React.FC<discountFormProps> = () => {
  const pricingTool = usePricingContext();

  const { availableDiscounts, discountSelected, setDiscountSelected } =
    pricingTool;

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (discountSelected.includes(value)) {
      // If the discount is already selected, remove it
      setDiscountSelected(
        discountSelected.filter((discountName) => discountName !== value)
      );
    } else {
      // If the discount is not selected, add it
      setDiscountSelected([...discountSelected, value]);
    }
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
          const { name, conditions } = discount;
          return (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  value={name}
                  onChange={handleCheckBox}
                  checked={discountSelected.includes(name)}
                />
                {name}
              </label>
              <div>
                {discountSelected.includes(name) ? (
                  <div>
                    <label>
                      <input type="checkbox" value={conditions} />
                      {conditions}
                    </label>
                  </div>
                ) : (
                  ""
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
