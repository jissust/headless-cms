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
    const precioCompraInput = document.querySelector(
      `input[name="total-compra-${index}"]`
    );
    const precioCompra = precioCompraInput ? parseFloat(precioCompraInput.value) : 0;
    const totalGanancia = total - cantidad * precioCompra;
    onChange({
      target: {
        name: `Productos.${index}.ganancia_por_item`,
        type: "decimal",
        value: totalGanancia
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
