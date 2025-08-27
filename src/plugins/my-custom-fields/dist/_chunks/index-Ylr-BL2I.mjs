import { jsxs, Fragment, jsx } from "react/jsx-runtime";
const InputPrecioPorUnidadGastosItem = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const nameSplit = name.split(".");
  const index = parseInt(nameSplit[1]);
  const handleChange = (e) => {
    const precioPorUnidad = parseInt(e.target.value, 10) || 0;
    onChange({
      target: { name, type: attribute.type, value: precioPorUnidad }
    });
    const cantidadGastos = document.querySelector(
      `input[name="Gastos.${index}.cantidad"]`
    );
    const cantidadGastosValue = cantidadGastos ? parseInt(cantidadGastos?.value) : 0;
    const total = precioPorUnidad * cantidadGastosValue;
    onChange({
      target: {
        name: `Gastos.${index}.total_por_item`,
        type: "number",
        value: total
      }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", children: "Precio por unidad" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        name,
        disabled,
        required,
        value,
        min: "0",
        type: "number",
        className: "input-customize",
        onChange: handleChange
      }
    )
  ] });
};
export {
  InputPrecioPorUnidadGastosItem
};
