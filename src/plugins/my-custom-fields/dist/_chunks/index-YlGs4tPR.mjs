import { jsxs, Fragment, jsx } from "react/jsx-runtime";
const InputTotalVentaGanancia = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", children: "Total ganancia" }),
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
          className: "input-customize"
        }
      )
    ] })
  ] });
};
export {
  InputTotalVentaGanancia
};
