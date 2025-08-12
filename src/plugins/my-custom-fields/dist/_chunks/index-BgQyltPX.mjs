import { jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
const InputNombreLocal = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [nombreLocal, setNombreLocal] = useState("");
  const url = window.location.href;
  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get("localId");
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
    fetch(`/api/ventas?populate=*&filters[documentId][$eq]=${ventaId}`).then((res) => res.json()).then((data) => {
      if (!data?.data) {
        console.error("Debe seleccionar una venta");
        return;
      }
      setNombreLocal(data.data[0]?.local?.nombre);
    }).catch((err) => {
      console.error("Error al cargar la venta", err);
    });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
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
export {
  InputNombreLocal
};
//# sourceMappingURL=index-BgQyltPX.mjs.map
