import { useEffect } from 'react';

const InputNumberTotalItemCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  useEffect(() => {
    console.log("InputNumberTotalItemCustomize value changed:", value);
    const totals = document.querySelectorAll('.input_total_item_product');
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
      <div className='container-number-currency'>
      <span>$</span>
      <input
        name={name}
        disabled={true}
        required={required}
        value={value}
        min="0"
        type="number"
        className="input-customize input_total_item_product"
      />
      </div>
    </>
  );
};

export { InputNumberTotalItemCustomize };
