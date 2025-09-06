import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const SelectCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [precio, setPrecio] = useState(0);
  const localId = queryParams.get("localId");
  const tipoDeVentaId = queryParams.get("tipoDeVentaId");
  const nameSplit = name.split(".");
  const index = parseInt(nameSplit[1]);
  useEffect(() => {
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
  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedProductoChange = productos.find((p) => p.id === parseInt(selectedId));
    setSelectedProducto(selectedProductoChange);
    console.log(selectedProductoChange);
    onChange({
      target: { name, type: attribute.type, value: selectedId }
    });
    if (selectedProductoChange) {
      let precioSelected = Number(tipoDeVentaId) == 1 ? selectedProductoChange.precio : selectedProductoChange.precio_mayorista;
      setPrecio(precioSelected);
      const stock = selectedProductoChange.stock;
      onChange({
        target: {
          name: `Productos.${index}.cantidad`,
          type: "number",
          value: stock > 0 ? 1 : 0
        }
      });
      onChange({
        target: {
          name: `Productos.${index}.total`,
          type: "number",
          value: stock > 0 ? precioSelected : 0
        }
      });
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", htmlFor: name, children: "Producto" }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        name,
        disabled,
        required,
        value,
        onChange: handleChange,
        className: "input-customize",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un producto" }),
          productos.map((producto) => /* @__PURE__ */ jsx("option", { value: producto.id, children: producto?.nombre || `Producto ${producto.id}` }, producto.id))
        ]
      }
    ),
    selectedProducto && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("label", { className: "label-customize p-1", children: Number(tipoDeVentaId) == 1 ? "Precio minorista" : "Precio mayorista" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "d-none",
          type: "number",
          name: `total-base-${index}`,
          value: precio,
          readOnly: true,
          disabled: true
        }
      )
    ] })
  ] });
};
export {
  SelectCustomize
};
