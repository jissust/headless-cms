const InputCantidadGastosItem = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cantidad = parseInt(e.target.value, 10) || 0;
    onChange({
      target: { name, type: attribute.type, value: cantidad },
    });

    const precioPorUnidad: HTMLInputElement | null = document.querySelector(
      `input[name="Gastos.${index}.precio_por_unidad"]`
    );

    const precioPorUnidadValue = precioPorUnidad ? parseFloat(precioPorUnidad?.value) : 0;
    const total = cantidad * precioPorUnidadValue;
    
    onChange({
      target: {
        name: `Gastos.${index}.total_por_item`,
        type: 'decimal',
        value: total,
      },
    });
  };

  return (
    <>
      <label className="label-customize">Cantidad</label>
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

export { InputCantidadGastosItem };
