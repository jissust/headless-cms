import { jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
const InputNombreVenta = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [nombreVenta, setNombreVenta] = useState("");
  const url = window.location.href;
  const queryParams = new URLSearchParams(window.location.search);
  const tipoDeVentaId = queryParams.get("tipoDeVentaId");
  if (tipoDeVentaId) {
    fetch(`/api/tipo-de-ventas?filters[id][$eq]=${tipoDeVentaId}`).then((res) => res.json()).then((data) => {
      if (!data?.data) {
        console.error("Debe seleccionar un tipo de venta");
        return;
      }
      setNombreVenta(data.data[0].nombre);
    }).catch((err) => {
      console.error("Error al cargar tipo de venta", err);
    });
  } else {
    const pathParts = url.split("/");
    const ventaId = pathParts[pathParts.length - 1];
    fetch(`/api/ventas?populate=*&filters[documentId][$eq]=${ventaId}`).then((res) => res.json()).then((data) => {
      if (!data?.data) {
        console.error("Debe seleccionar una venta");
        return;
      }
      setNombreVenta(data.data[0]?.tipo_de_venta?.nombre);
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
      value: nombreVenta,
      type: "text",
      className: "input-customize"
    }
  ) });
};
export {
  InputNombreVenta
};
//# sourceMappingURL=index-Bj59QtbH.mjs.map
