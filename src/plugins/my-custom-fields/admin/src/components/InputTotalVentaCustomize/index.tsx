const InputTotalVentaCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  
  (props.initialValue > 0) ? console.log("Initial Value:", props.initialValue) : console.log("value ", value);
  
  return (
    <>
      <label className="label-customize">Total</label>
      <div className="container-number-currency">
       <span>$</span>
       <input
        name={name}
        disabled={true}
        required={required}
        value={ (props.initialValue > 0) ? props.initialValue : value }
        min="0"
        type="number"
        className="input-customize"
      />
      </div>
    </>
  );
};

export { InputTotalVentaCustomize };
