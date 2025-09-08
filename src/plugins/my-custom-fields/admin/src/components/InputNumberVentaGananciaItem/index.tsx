import { useEffect } from 'react';

const InputNumberVentaGananciaItem = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  useEffect(() => {
    const totals = document.querySelectorAll('.input_ganancia_item_product');
    let total = 0;

    for (const input of totals) {
      const val = parseFloat((input as HTMLInputElement).value);
      if (!isNaN(val)) {
        total += val;
      }
    }
    console.log('total ganancia', total);
    onChange({
      target: {
        name: 'total_ganancia',
        type: 'number',
        value: total,
      },
    });

}, [value]);

  return (
    <>
      <label className="label-customize">Ganancia</label>
      <input
        name={name}
        disabled={true}
        required={required}
        value={value}
        min="0"
        type="number"
        className="input-customize input_ganancia_item_product"
      />
    </>
  );
};

export { InputNumberVentaGananciaItem };
