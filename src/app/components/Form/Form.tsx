"use client";

import LensForm from "../LensForm/LensForm";
import OptionsForm from "../OptionsForm/OptionsForm";
import DiscountForm from "../DiscountForm/DiscountForm";

const mockOptions = [
  ["anti-glare", "15", "Y"],
  ["blue light filter", "20", "Y"],
  ["UV protection", "10", "Y"],
  ["scratch resistant", "12", "Y"],
  ["none", "0", "N"],
];

const mockLabels = ["lens treatment", "price", "family plan eligible"];

const mockLabels2 = ["add on", "price", "family plan eligible"];

const mockOptions2 = [
  ["polarized coating", "25", "Y"],
  ["hydrophobic coating", "18", "Y"],
  ["anti-fog", "22", "Y"],
  ["gradient tint", "30", "Y"],
  ["photochromic lenses", "40", "N"],
];

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
  return (
    <div>
      <form className="flex flex-col">
        <label htmlFor="framePrice">
          Frame Price
          <input type="number" name="framePrice" />
        </label>
        <LensForm />
        <OptionsForm optionsData={mockOptions} labelsArray={mockLabels} />
        <OptionsForm optionsData={mockOptions2} labelsArray={mockLabels2} />
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
