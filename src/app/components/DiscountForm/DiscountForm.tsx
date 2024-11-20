type discountFormProps = {
  labelsArray: string[];
};

const DiscountForm: React.FC<discountFormProps> = ({ labelsArray }) => {
  return (
    <div className="flex flex-col">
      <form>
        {labelsArray.map((label, i) => {
          return <label key={i}>{label}</label>;
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
