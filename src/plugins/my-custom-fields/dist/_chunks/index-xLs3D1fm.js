"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const InputNombreLocal = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [nombreLocal, setNombreLocal] = react.useState("");
  const url = window.location.href;
  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get("localId");
  console.log(window.location.href);
  if (localId) {
    fetch(`/api/locals?filters[id][$eq]=${localId}`).then((res) => res.json()).then((data) => {
      if (!data?.data) {
        console.error("Debe seleccionar un local");
        return;
      }
      setNombreLocal(data.data[0].nombre);
    }).catch((err) => {
      console.error("Error al cargar el local", err);
    });
  } else {
    const pathParts = url.split("/");
    const ventaId = pathParts[pathParts.length - 1];
    console.log("ventaId", ventaId);
    fetch(`/api/ventas?populate=*&filters[documentId][$eq]=${ventaId}`).then((res) => res.json()).then((data) => {
      if (!data?.data) {
        console.error("Debe seleccionar una venta");
        return;
      }
      console.log("data", data);
    }).catch((err) => {
      console.error("Error al cargar la venta", err);
    });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      name,
      disabled: true,
      required,
      value: nombreLocal,
      type: "text",
      className: "input-customize"
    }
  ) });
};
exports.InputNombreLocal = InputNombreLocal;
//# sourceMappingURL=index-xLs3D1fm.js.map
