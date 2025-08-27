"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const InputTotalGastos = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
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
        className: "input-customize"
      }
    )
  ] });
};
exports.InputTotalGastos = InputTotalGastos;
