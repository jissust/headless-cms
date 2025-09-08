import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
const InputNumberTotalItemCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", children: "Total" }),
    /* @__PURE__ */ jsxs("div", { className: "container-number-currency", children: [
      /* @__PURE__ */ jsx("span", { children: "$" }),
      /* @__PURE__ */ jsx(
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
    ] })
  ] });
};
export {
  InputNumberTotalItemCustomize
};
