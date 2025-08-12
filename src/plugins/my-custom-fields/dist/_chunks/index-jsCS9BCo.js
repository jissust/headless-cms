"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const InputNombreVenta = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [nombreVenta, setNombreVenta] = react.useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const tipoDeVentaId = queryParams.get("tipoDeVentaId");
  fetch(`/api/tipo-de-ventas?filters[id][$eq]=${tipoDeVentaId}`).then((res) => res.json()).then((data) => {
    if (!data?.data) {
      console.error("Debe seleccionar un tipo de venta");
      return;
    }
    setNombreVenta(data.data[0].nombre);
  }).catch((err) => {
    console.error("Error al cargar tipo de venta", err);
  });
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      name,
      disabled: true,
      required,
      value: nombreVenta,
      type: "text",
      className: "input-customize"
    }
  ) });
};
exports.InputNombreVenta = InputNombreVenta;
//# sourceMappingURL=index-jsCS9BCo.js.map
