const InputNumberCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

  console.log(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cantidad = parseInt(e.target.value, 10) || 0;
    onChange({
      target: { name, type: attribute.type, value: cantidad },
    });

    const precioBaseInput: HTMLInputElement | null = document.querySelector(
      `input[name="total-base-${index}"]`
    );

    const precioBase = precioBaseInput ? parseFloat(precioBaseInput.value) : 0;
    const total = cantidad * precioBase;

    onChange({
      target: {
        name: `Productos.${index}.total`,
        type: 'decimal',
        value: total,
      },
    });

  };

  return (
    <>
      <label>Cantidad</label>
      <input
        name={name}
        disabled={disabled}
        required={required}
        value={value}
        min="0"
        onChange={handleChange}
        type="number"
      />
    </>
  );
};

export { InputNumberCustomize };
