"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const TitleSection = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "h1", children: attribute?.options?.label });
};
exports.TitleSection = TitleSection;
