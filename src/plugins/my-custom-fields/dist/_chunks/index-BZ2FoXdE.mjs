import { jsxs, Fragment, jsx } from "react/jsx-runtime";
const InputNumberCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const nameSplit = name.split(".");
  const index = parseInt(nameSplit[1]);
  const handleChange = (e) => {
    const cantidad = parseInt(e.target.value, 10) || 0;
    onChange({
      target: { name, type: attribute.type, value: cantidad }
    });
    const precioBaseInput = document.querySelector(
      `input[name="total-base-${index}"]`
    );
    const precioBase = precioBaseInput ? parseFloat(precioBaseInput.value) : 0;
    const total = cantidad * precioBase;
    onChange({
      target: {
        name: `Productos.${index}.total`,
        type: "decimal",
        value: total
      }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", children: "Cantidad" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        name,
        disabled,
        required,
        value,
        min: "0",
        onChange: handleChange,
        type: "number",
        className: "input-customize"
      }
    )
  ] });
};
export {
  InputNumberCustomize
};
//# sourceMappingURL=index-BZ2FoXdE.mjs.map
