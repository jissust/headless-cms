const InputNumberTotalItemCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

  console.log(props);

  return (
    <>
      <label>Total</label>
      <input
        name={name}
        disabled={true}
        required={required}
        value={value}
        min="0"
        type="number"
      />
    </>
  );
};

export { InputNumberTotalItemCustomize };
