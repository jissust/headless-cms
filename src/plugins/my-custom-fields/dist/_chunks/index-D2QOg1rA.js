"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const InputCantidadGastosItem = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const nameSplit = name.split(".");
  const index = parseInt(nameSplit[1]);
  const handleChange = (e) => {
    const cantidad = parseInt(e.target.value, 10) || 0;
    onChange({
      target: { name, type: attribute.type, value: cantidad }
    });
    const precioPorUnidad = document.querySelector(
      `input[name="Gastos.${index}.precio_por_unidad"]`
    );
    const precioPorUnidadValue = precioPorUnidad ? parseFloat(precioPorUnidad?.value) : 0;
    const total = cantidad * precioPorUnidadValue;
    onChange({
      target: {
        name: `Gastos.${index}.total_por_item`,
        type: "decimal",
        value: total
      }
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", children: "Cantidad" }),
    /* @__PURE__ */ jsxRuntime.jsx(
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
exports.InputCantidadGastosItem = InputCantidadGastosItem;
