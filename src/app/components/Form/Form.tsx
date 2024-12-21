"use client";

import LensForm from "../LensForm/LensForm";
import OptionsForm from "../OptionsForm/OptionsForm";
import DiscountForm from "../DiscountForm/DiscountForm";
import { useGoogleSheetsContext } from "@/lib/context/GoogleSheetsContext";
import { fetchLabels, fetchOptions } from "@/services/organizeData";

const bogo = [
  "Apply BOGO?",
  "All sets purchased within 30 days?",
  "discount will be applied to",
  "discount amount",
];

const family = [
  "Apply Family Plan?",
  "Are there at least two family members in this order?",
  "Lens discount will be applied to",
  "discount amount",
];
const Form: React.FC = () => {
  const data = useGoogleSheetsContext();
  //console.log("data", data);
  if (!data) {
    return <p>loading...</p>;
  }

  const { sheetsData, loading, error } = data;
  const { addOn, lens, lensTreatment, mcssAddon, packages, superflexAddon } =
    sheetsData;

  return (
    <div>
      <form className="flex flex-col">
        <label htmlFor="framePrice">
          Frame Price
          <input type="number" name="framePrice" />
        </label>
        <LensForm />
        <OptionsForm
          optionsData={fetchOptions(lensTreatment)}
          label={fetchLabels(lensTreatment)}
        />
        <OptionsForm
          optionsData={fetchOptions(addOn)}
          label={fetchLabels(addOn)}
        />
        <div>
          <label className="flex">
            Lens Subtotal
            <p>$$$</p>
          </label>
          <label className="flex">
            Frame & Lens Subtotal
            <p>$$$</p>
          </label>
        </div>
        <div>
          <h4>order subtotal</h4>
          <div>
            <label>
              total frame price
              <p>$$$</p>
            </label>
            <label>
              total lenses
              <p>$$$</p>
            </label>
            <label>
              order subtotal
              <p>$$$</p>
            </label>
          </div>
        </div>
      </form>
      <div>
        <h3>Discounts</h3>
        <p>BOGO</p>
        <DiscountForm labelsArray={bogo} />
        <p>Family Plan</p>
        <DiscountForm labelsArray={family} />
      </div>
    </div>
  );
};

export default Form;
