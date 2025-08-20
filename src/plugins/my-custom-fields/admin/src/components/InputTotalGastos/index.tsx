const InputTotalGastos = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  return (
    <>
      <label className="label-customize">Total</label>
      <input
        name={name}
        disabled={true}
        required={required}
        value={value}
        min="0"
        type="number"
        className="input-customize"
      />
    </>
  );
};

export { InputTotalGastos };
