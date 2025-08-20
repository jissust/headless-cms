import { useEffect } from 'react';

const InputTotalGastosItem = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  useEffect(() => {
    const totals = document.querySelectorAll('.input_total_item_gastos_product');
    let total = 0;

    for (const input of totals) {
      const val = parseFloat((input as HTMLInputElement).value);
      if (!isNaN(val)) {
        total += val;
      }
    }

    onChange({
      target: {
        name: 'total',
        type: 'number',
        value: total,
      },
    });
  }, [value]);

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
        className="input-customize input_total_item_gastos_product"
      />
    </>
  );
};

export { InputTotalGastosItem };
