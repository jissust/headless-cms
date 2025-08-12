"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const InputNombreLocal = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [nombreLocal, setNombreLocal] = react.useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get("localId");
  console.log(window.location.href);
  fetch(`/api/locals?filters[id][$eq]=${localId}`).then((res) => res.json()).then((data) => {
    if (!data?.data) {
      console.error("Debe seleccionar un local");
      return;
    }
    setNombreLocal(data.data[0].nombre);
  }).catch((err) => {
    console.error("Error al cargar el local", err);
  });
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
//# sourceMappingURL=index-B_p3dYEb.js.map
