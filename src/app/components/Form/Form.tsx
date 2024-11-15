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
    <div>
      <FrameForm frameData={frameData} />
      <OptionsForm optionsData={mockOptions} labelsArray={mockLabels} />
      <OptionsForm optionsData={mockOptions2} labelsArray={mockLabels2} />
    </div>
  );
};

export default Form;
