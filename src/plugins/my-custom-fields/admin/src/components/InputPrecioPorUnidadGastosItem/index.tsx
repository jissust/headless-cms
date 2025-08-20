const InputPrecioPorUnidadGastosItem = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const precioPorUnidad = parseInt(e.target.value, 10) || 0;
    onChange({
      target: { name, type: attribute.type, value: precioPorUnidad },
    });
  };

  return (
    <>
      <label className="label-customize">Precio por unidad</label>
      <input
        name={name}
        disabled={disabled}
        required={required}
        value={value}
        min="0"
        type="number"
        className="input-customize"
        onChange={handleChange}
      />
    </>
  );
};

export { InputPrecioPorUnidadGastosItem };
