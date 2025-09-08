const InputTotalVentaGanancia = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  return (
    <>
      <label className="label-customize">Total ganancia</label>
      <div className="container-number-currency">
        <span>$</span>
        <input
          name={name}
          disabled={true}
          required={required}
          value={value}
          min="0"
          type="number"
          className="input-customize"
        />
      </div>
    </>
  );
};

export { InputTotalVentaGanancia };
