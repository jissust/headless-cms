import { parse } from 'path';
import React, { useState, useEffect } from 'react';

const SelectCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  const [precio, setPrecio] = useState<number>(0);
  const [precioCompra, setPrecioCompra] = useState<number>(0);
  const [tipoDeVenta, setTipoDeVenta] = useState<any>(null);
  const localId = queryParams.get('localId');
  const tipoDeVentaId = queryParams.get('tipoDeVentaId');
  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

  useEffect(() => {
    if (!localId) {
      let urlSplit = window.location.href.split('/');
      let documentId = urlSplit[urlSplit.length - 1];

      fetch(`/api/ventas?populate=*&filters[documentId][$eq]=${documentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data?.data) return;
          filtrarLocalesPorLocal(data.data[0].local.id);
        })
        .catch((err) => {
          console.error('Error al cargar productos', err);
        });
    } else {
      filtrarLocalesPorLocal(localId);
    }
    getTipoDeVenta(tipoDeVentaId);
  }, []);

  const filtrarLocalesPorLocal = (localId: any) => {
    fetch(`/api/productos?populate=*&filters[locales][id][$eq]=${localId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        setProductos(data.data);
      })
      .catch((err) => {
        console.error('Error al cargar productos', err);
      });
  };

  const getTipoDeVenta = (tipoDeVentaId: any) => {
    fetch(`/api/tipo-de-ventas?populate=*&filters[id][$eq]=${tipoDeVentaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        setTipoDeVenta(data.data[0]);
      })
      .catch((err) => {
        console.error('Error al cargar tipo de venta', err);
      });
  }

  const handleChange = (selectedId: string) => {
    const selectedProductoChange = productos.find((p) => p.id === parseInt(selectedId));

    setSelectedProducto(selectedProductoChange);

    const cantidadHTML: HTMLInputElement | null = document.querySelector(
      `input[name="Productos.${index}.cantidad"]`
    );
    const cantidad = cantidadHTML?.value;
    
    onChange({
      target: { name, type: attribute.type, value: selectedId },
    });

    if (selectedProductoChange) {
      /*let precioSelected =
        Number(tipoDeVentaId) == 1
          ? selectedProductoChange.precio
          : selectedProductoChange.precio_mayorista;*/
      let precioSelected = tipoDeVenta?.nombre?.toLowerCase().includes("mayorista")
        ? selectedProductoChange.precio_mayorista
        : selectedProductoChange.precio;

      setPrecio(precioSelected);
      const stock = selectedProductoChange.stock;

      setPrecioCompra(selectedProductoChange.precio_compra);

      const totalGanancia = (precioSelected * parseInt(cantidad || '0')) - (selectedProductoChange.precio_compra * parseInt(cantidad || '0'));

      /*onChange({
        target: {
          name: `Productos.${index}.cantidad`,
          type: 'number',
          value: stock > 0 ? 1 : 0,
        },
      });*/

      onChange({
        target: {
          name: `Productos.${index}.total`,
          type: 'number',
          value: stock > 0 ? precioSelected * parseInt(cantidad || '0') : 0,
        },
      });

      onChange({
        target: {
          name: `Productos.${index}.ganancia_por_item`,
          type: 'number',
          value: totalGanancia,
        },
      });
    }
  };

  useEffect(() => {
    if (value && productos.length > 0) {
      handleChange(value);
    }
  }, [value, productos]);

  return (
    <>
      <label className="label-customize" htmlFor={name}>
        Producto
      </label>
      <select
        name={name}
        disabled={disabled}
        required={required}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="input-customize"
      >
        <option value="">Seleccione un producto</option>
        {productos.map((producto: any) => (
          <option key={producto.id} value={producto.id}>
            {producto?.nombre || `Producto ${producto.id}`}
          </option>
        ))}
      </select>

      {selectedProducto && (
        <>
          <label className="label-customize p-1">
            {tipoDeVenta?.nombre?.toLowerCase().includes("mayorista")
              ? `Precio mayorista: $ ${precio} (por unidad)`
              : `Precio minorista: $ ${precio} (por unidad)`}
          </label>
          <input
            className="d-none"
            type="number"
            name={`total-base-${index}`}
            value={precio}
            readOnly
            disabled
          />

          <label className="label-customize p-1">{`Precio de compra: $ ${precioCompra} (por unidad)`}</label>

          <input
            className="d-none"
            type="number"
            name={`total-compra-${index}`}
            value={precioCompra}
            readOnly
            disabled
          />
        </>
      )}
    </>
  );
};

export { SelectCustomize };
