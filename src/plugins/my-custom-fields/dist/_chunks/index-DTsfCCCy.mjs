import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const SelectCustomize = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [precio, setPrecio] = useState(0);
  const [precioCompra, setPrecioCompra] = useState(0);
  const [tipoDeVenta, setTipoDeVenta] = useState(null);
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
    getTipoDeVenta(tipoDeVentaId);
  }, []);
  const filtrarLocalesPorLocal = (localId2) => {
    fetch(`/api/productos?populate=*&filters[locales][id][$eq]=${localId2}&sort=nombre:desc&pagination[pageSize]=1000`).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      console.log(data.data);
      setProductos(data.data);
    }).catch((err) => {
      console.error("Error al cargar productos", err);
    });
  };
  const getTipoDeVenta = (tipoDeVentaId2) => {
    fetch(`/api/tipo-de-ventas?populate=*&filters[id][$eq]=${tipoDeVentaId2}`).then((res) => res.json()).then((data) => {
      if (!data?.data) return;
      setTipoDeVenta(data.data[0]);
    }).catch((err) => {
      console.error("Error al cargar tipo de venta", err);
    });
  };
  const handleChange = (selectedId) => {
    const selectedProductoChange = productos.find((p) => p.id === parseInt(selectedId));
    console.log(selectedProductoChange);
    setSelectedProducto(selectedProductoChange);
    const cantidadHTML = document.querySelector(
      `input[name="Productos.${index}.cantidad"]`
    );
    const cantidad = cantidadHTML?.value;
    onChange({
      target: { name, type: attribute.type, value: selectedId }
    });
    if (selectedProductoChange) {
      let precioSelected = tipoDeVenta?.nombre?.toLowerCase().includes("mayorista") ? selectedProductoChange.precio_mayorista : selectedProductoChange.precio;
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
  useEffect(() => {
    if (value && productos.length > 0) {
      handleChange(value);
    }
  }, [value, productos]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", htmlFor: name, children: "Producto" }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        name,
        disabled,
        required,
        value,
        onChange: (e) => handleChange(e.target.value),
        className: "input-customize",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un producto" }),
          productos.map((producto) => /* @__PURE__ */ jsx("option", { value: producto.id, children: `${producto?.nombre} (${producto?.tipo_de_moneda?.codigo})` || `Producto ${producto.id}` }, producto.id))
        ]
      }
    ),
    selectedProducto && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("label", { className: "label-customize p-1", children: tipoDeVenta?.nombre?.toLowerCase().includes("mayorista") ? `Precio mayorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad)` : `Precio minorista: ${selectedProducto.tipo_de_moneda?.simbolo} ${precio} (por unidad)` }),
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
      ),
      /* @__PURE__ */ jsx("label", { className: "label-customize p-1", children: `Precio de compra: ${selectedProducto.tipo_de_moneda?.simbolo} ${precioCompra} (por unidad)` }),
      /* @__PURE__ */ jsx(
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
export {
  SelectCustomize
};
