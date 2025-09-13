import { jsxs, Fragment, jsx } from "react/jsx-runtime";
const InputTotalGenerico = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const handleChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    onChange({
      target: { name, type: attribute.type, value: val }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", children: attribute?.options?.label }),
    /* @__PURE__ */ jsxs("div", { className: "container-number-currency", children: [
      /* @__PURE__ */ jsx("span", { children: "$" }),
      /* @__PURE__ */ jsx(
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
    ] })
  ] });
};
export {
  InputTotalGenerico
};
