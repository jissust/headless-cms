"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const SelectCustomizeGasto = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = react.useState([]);
  const localId = queryParams.get("localId");
  const nameSplit = name.split(".");
  parseInt(nameSplit[1]);
  react.useEffect(() => {
    if (!localId) {
      let urlSplit = window.location.href.split("/");
      let documentId = urlSplit[urlSplit.length - 1];
      console.log(documentId);
      fetch(`/api/gastos?populate=*&filters[documentId][$eq]=${documentId}`).then((res) => res.json()).then((data) => {
        if (!data?.data) return;
        filtrarLocalesPorLocal(data.data[0].local.id);
      }).catch((err) => {
        console.error("Error al cargar productos", err);
      });
    } else {
      filtrarLocalesPorLocal(localId);
    }
  }, []);
  const filtrarLocalesPorLocal = (localId2) => {
    fetch(`/api/productos?populate=*&filters[locales][id][$eq]=${localId2}`).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      setProductos(data.data);
    }).catch((err) => {
      console.error("Error al cargar productos", err);
    });
  };
  const handleChange = (e) => {
    const selectedId = e.target.value;
    console.log(selectedId);
    onChange({
      target: { name, type: attribute.type, value: selectedId }
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", htmlFor: name, children: "Producto" }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "select",
      {
        name,
        disabled,
        required,
        value,
        onChange: handleChange,
        className: "input-customize",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "Seleccione un producto" }),
          productos.map((producto) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: producto.id, children: producto?.nombre || `Producto ${producto.id}` }, producto.id))
        ]
      }
    )
  ] });
};
exports.SelectCustomizeGasto = SelectCustomizeGasto;
