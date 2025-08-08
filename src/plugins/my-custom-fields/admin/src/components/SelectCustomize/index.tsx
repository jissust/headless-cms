import React, { useState, useEffect } from 'react';

const SelectCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  
  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get('localId');
  const tipoDeVentaId = queryParams.get('tipoDeVentaId');
  
  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);
  
  let url = `/api/productos?populate=*`;
  if(value === undefined) {
    url += `&filters[locales][id][$eq]=${localId}`;
  }
  
  useEffect(() => {
    fetch(`${url}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        setProductos(data.data);
      })
      .catch((err) => {
        console.error('Error al cargar productos', err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedProductoChange = productos.find((p) => p.id === parseInt(selectedId));

    setSelectedProducto(selectedProductoChange);

    onChange({
      target: { name, type: attribute.type, value: selectedId },
    });

    if (selectedProductoChange) {
      const precio = (Number(tipoDeVentaId) == 1) ? selectedProductoChange.precio : selectedProductoChange.precio_mayorista;
      let tipoDeVentaLabel =  (Number(tipoDeVentaId) == 1) ? "Venta minorista" : "Venta mayorista";
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
          value: precio,
        },
      });
    }
  };

  return (
    <>
      <label className='label-customize' htmlFor={name}>Producto</label>
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
          <label className='label-customize p-1'>{(Number(tipoDeVentaId) == 1) ? "Venta minorista" : "Venta mayorista"}</label>
          <input className='d-none' type="number" name={`total-base-${index}`} value={selectedProducto.precio} readOnly disabled/>
        </>
      )}

    </>
  );
};

export { SelectCustomize };
