const InputTotalGenerico = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange({
      target: { name, type: attribute.type, value: val },
    });
  }

  return (
    <>
      <label className="label-customize">{attribute?.options?.label}</label>
      <div className="container-number-currency">
        <span>$</span>
        <input
          name={name}
          disabled={attribute?.options?.disabled || disabled}
          required={required}
          value={value}
          min="0"
          type="number"
          className="input-customize"
          onChange={handleChange}
        />
      </div>
      <span className="input-description">Solo comas para decimales, sin puntos. Ej: 1234,56</span>
    </>
  );
};

export { InputTotalGenerico };
