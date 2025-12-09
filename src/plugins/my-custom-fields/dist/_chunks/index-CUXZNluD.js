"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const InputNumberVentaGananciaItem = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  react.useEffect(() => {
    const totals = document.querySelectorAll(".input_ganancia_item_product");
    let total = 0;
    for (const input of totals) {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        total += val;
      }
    }
    onChange({
      target: {
        name: "total_ganancia",
        type: "number",
        value: total
      }
    });
  }, [value]);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", children: "Ganancia" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "container-number-currency", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "$" }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          name,
          disabled: true,
          required,
          value,
          min: "0",
          type: "number",
          className: "input-customize input_ganancia_item_product"
        }
      )
    ] })
  ] });
};
exports.InputNumberVentaGananciaItem = InputNumberVentaGananciaItem;
