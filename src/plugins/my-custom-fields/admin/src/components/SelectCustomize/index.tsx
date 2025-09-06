import React, { useState, useEffect } from 'react';

const SelectCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  const [precio, setPrecio] = useState<number>(0);
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
          filtrarLocalesPorLocal(data.data[0].local.id)
        })
        .catch((err) => {
          console.error('Error al cargar productos', err);
        });
    } else {
      filtrarLocalesPorLocal(localId)
    }
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedProductoChange = productos.find((p) => p.id === parseInt(selectedId));

    setSelectedProducto(selectedProductoChange);
    console.log(selectedProductoChange);
    onChange({
      target: { name, type: attribute.type, value: selectedId },
    });

    if (selectedProductoChange) {
      let precioSelected =
        Number(tipoDeVentaId) == 1
          ? selectedProductoChange.precio
          : selectedProductoChange.precio_mayorista;
      setPrecio(precioSelected);
      const stock = selectedProductoChange.stock;

      onChange({
        target: {
          name: `Productos.${index}.cantidad`,
          type: 'number',
          value: stock > 0 ? 1 : 0,
        },
      });

      onChange({
        target: {
          name: `Productos.${index}.total`,
          type: 'number',
          value: stock > 0 ? precioSelected : 0,
        },
      });
    }
  };

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
        onChange={handleChange}
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
            {Number(tipoDeVentaId) == 1 ? 'Precio minorista' : 'Precio mayorista'}
          </label>
          <input
            className="d-none"
            type="number"
            name={`total-base-${index}`}
            value={precio}
            readOnly
            disabled
          />
        </>
      )}
    </>
  );
};

export { SelectCustomize };
