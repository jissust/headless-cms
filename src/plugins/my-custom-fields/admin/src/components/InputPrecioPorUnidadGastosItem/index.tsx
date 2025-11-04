const InputPrecioPorUnidadGastosItem = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const precioPorUnidad = parseFloat(e.target.value);//parseInt(e.target.value, 10) || 0;
    onChange({
      target: { name, type: attribute.type, value: precioPorUnidad },
    });

    const cantidadGastos: HTMLInputElement | null = document.querySelector(
      `input[name="Gastos.${index}.cantidad"]`
    );

    const cantidadGastosValue = cantidadGastos ? parseFloat(cantidadGastos?.value) :0; //cantidadGastos ? parseInt(cantidadGastos?.value) : 0;
    const total = precioPorUnidad * cantidadGastosValue;

    onChange({
      target: {
        name: `Gastos.${index}.total_por_item`,
        type: 'number',
        value: total,
      },
    });
  };

  return (
    <>
      <label className="label-customize">Precio por unidad</label>
      <div className="container-number-currency">
        <span>$</span>
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
      </div>
      <span className="input-description">Solo comas para decimales, sin puntos. Ej: 1234,56</span>
    </>
  );
};

export { InputPrecioPorUnidadGastosItem };
