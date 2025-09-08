import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
const InputNumberVentaGananciaItem = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  useEffect(() => {
    const totals = document.querySelectorAll(".input_ganancia_item_product");
    let total = 0;
    for (const input of totals) {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        total += val;
      }
    }
    console.log("total ganancia", total);
    onChange({
      target: {
        name: "total_ganancia",
        type: "number",
        value: total
      }
    });
  }, [value]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", children: "Ganancia" }),
    /* @__PURE__ */ jsx(
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
  ] });
};
export {
  InputNumberVentaGananciaItem
};
