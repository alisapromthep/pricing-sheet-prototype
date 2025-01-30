import { usePricingContext } from "@/lib/context/PricingContext";

type discountFormProps = {
  labelsArray: string[];
};

const DiscountForm: React.FC<discountFormProps> = () => {
  const pricingTool = usePricingContext();

  const { availableDiscounts, discountSelected, setDiscountSelected } =
    pricingTool;

  const handleCheckBox = (e) => {
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
  return (
    <div className="flex flex-col">
      <form>
        {availableDiscounts.map((discount, i) => {
          //console.log(discount);
          const { name, conditions } = discount;
          return (
            <div key={i}>
              <label>
                <input type="checkbox" value={name} onClick={handleCheckBox} />
                {name}
              </label>
              <div>
                {discountSelected.includes(name) ? (
                  <div>
                    <label>
                      <input type="checkbox" />
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
      </form>
      <div>
        <p>Total cost (frames & lenses)</p>
        <p>$$$</p>
      </div>
    </div>
  );
};

export default DiscountForm;
