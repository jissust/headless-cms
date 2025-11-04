"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const InputTotalGenerico = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const handleChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    onChange({
      target: { name, type: attribute.type, value: val }
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", children: attribute?.options?.label }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "container-number-currency", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "$" }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          name,
          disabled: attribute?.options?.disabled || disabled,
          required,
          value,
          min: "0",
          type: "number",
          className: "input-customize",
          onChange: handleChange
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "input-description", children: "Solo comas para decimales, sin puntos. Ej: 1234,56" })
  ] });
};
exports.InputTotalGenerico = InputTotalGenerico;
