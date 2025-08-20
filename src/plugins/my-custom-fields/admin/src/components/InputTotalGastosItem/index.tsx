import { useEffect } from 'react';

const InputTotalGastosItem = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

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

export { InputTotalGastosItem };
