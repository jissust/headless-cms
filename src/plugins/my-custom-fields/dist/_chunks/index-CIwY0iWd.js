"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const InputNumberTotalItemCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  react.useEffect(() => {
    const totals = document.querySelectorAll(".input_total_item_product");
    let total = 0;
    for (const input of totals) {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        total += val;
      }
    }
    onChange({
      target: {
        name: "total",
        type: "number",
        value: total
      }
    });
  }, [value]);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", children: "Total" }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        name,
        disabled: true,
        required,
        value,
        min: "0",
        type: "number",
        className: "input-customize input_total_item_product"
      }
    )
  ] });
};
exports.InputNumberTotalItemCustomize = InputNumberTotalItemCustomize;
//# sourceMappingURL=index-CIwY0iWd.js.map
