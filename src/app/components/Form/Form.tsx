"use client";

import FrameForm from "../FrameForm/FrameForm";
import OptionsForm from "../OptionsForm/OptionsForm";

type FormProps = {
  frameData: string[][];
};
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
const Form: React.FC<FormProps> = ({ frameData }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="framePrice">
        Frame Price
        <input type="number" name="framePrice" />
      </label>
      <FrameForm frameData={frameData} />
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
    </div>
  );
};

export default Form;
