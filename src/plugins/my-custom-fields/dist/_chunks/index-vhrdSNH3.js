"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const SelectCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = react.useState([]);
  const [selectedProducto, setSelectedProducto] = react.useState(null);
  const [precio, setPrecio] = react.useState(0);
  const [precioCompra, setPrecioCompra] = react.useState(0);
  const localId = queryParams.get("localId");
  const tipoDeVentaId = queryParams.get("tipoDeVentaId");
  const nameSplit = name.split(".");
  const index = parseInt(nameSplit[1]);
  react.useEffect(() => {
    if (!localId) {
      let urlSplit = window.location.href.split("/");
      let documentId = urlSplit[urlSplit.length - 1];
      fetch(`/api/ventas?populate=*&filters[documentId][$eq]=${documentId}`).then((res) => res.json()).then((data) => {
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
  const handleChange = (selectedId) => {
    const selectedProductoChange = productos.find((p) => p.id === parseInt(selectedId));
    setSelectedProducto(selectedProductoChange);
    const cantidadHTML = document.querySelector(
      `input[name="Productos.${index}.cantidad"]`
    );
    const cantidad = cantidadHTML?.value;
    console.log(`Cantidad: ${cantidad}`);
    onChange({
      target: { name, type: attribute.type, value: selectedId }
    });
    if (selectedProductoChange) {
      let precioSelected = Number(tipoDeVentaId) == 1 ? selectedProductoChange.precio : selectedProductoChange.precio_mayorista;
      setPrecio(precioSelected);
      const stock = selectedProductoChange.stock;
      setPrecioCompra(selectedProductoChange.precio_compra);
      const totalGanancia = precioSelected * parseInt(cantidad || "0") - selectedProductoChange.precio_compra * parseInt(cantidad || "0");
      onChange({
        target: {
          name: `Productos.${index}.total`,
          type: "number",
          value: stock > 0 ? precioSelected * parseInt(cantidad || "0") : 0
        }
      });
      onChange({
        target: {
          name: `Productos.${index}.ganancia_por_item`,
          type: "number",
          value: totalGanancia
        }
      });
    }
  };
  console.log(`value: ${value}`);
  react.useEffect(() => {
    if (value && productos.length > 0) {
      handleChange(value);
    }
  }, [value, productos]);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", htmlFor: name, children: "Producto" }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      "select",
      {
        name,
        disabled,
        required,
        value,
        onChange: (e) => handleChange(e.target.value),
        className: "input-customize",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "Seleccione un producto" }),
          productos.map((producto) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: producto.id, children: producto?.nombre || `Producto ${producto.id}` }, producto.id))
        ]
      }
    ),
    selectedProducto && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize p-1", children: Number(tipoDeVentaId) == 1 ? `Precio minorista: $ ${precio}` : `Precio mayorista: $ ${precio}` }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          className: "d-none",
          type: "number",
          name: `total-base-${index}`,
          value: precio,
          readOnly: true,
          disabled: true
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize p-1", children: `Precio de compra: $ ${precioCompra}` }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          className: "d-none",
          type: "number",
          name: `total-compra-${index}`,
          value: precioCompra,
          readOnly: true,
          disabled: true
        }
      )
    ] })
  ] });
};
exports.SelectCustomize = SelectCustomize;
