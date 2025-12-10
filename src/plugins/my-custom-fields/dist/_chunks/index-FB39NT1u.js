"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const InputTotalVentaCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  props.initialValue > 0 ? console.log("Initial Value:", props.initialValue) : console.log("value ", value);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", children: "Total" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "container-number-currency", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "$" }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          name,
          disabled: true,
          required,
          value: props.initialValue > 0 ? props.initialValue : value,
          min: "0",
          type: "number",
          className: "input-customize"
        }
      )
    ] })
  ] });
};
exports.InputTotalVentaCustomize = InputTotalVentaCustomize;
