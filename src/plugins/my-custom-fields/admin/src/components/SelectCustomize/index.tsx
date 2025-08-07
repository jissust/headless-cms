import React, { useState, useEffect } from 'react';

const SelectCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [productos, setProductos] = useState<any[]>([]);

  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get('localId');

  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);

  useEffect(() => {
    fetch(`/api/productos?populate=*&filters[locales][id][$eq]=${localId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data?.data) return;
        setProductos(data.data);
      })
      .catch((err) => {
        console.error('Error al cargar productos', err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedProducto = productos.find((p) => p.id === parseInt(selectedId));

    onChange({
      target: { name, type: attribute.type, value: selectedId },
    });
    console.log(selectedProducto);

    if (selectedProducto) {
      const precio = selectedProducto.precio;
      const stock = selectedProducto.stock;

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
      <label htmlFor={name}>Producto</label>
      <select
        name={name}
        disabled={disabled}
        required={required}
        value={value}
        onChange={handleChange}
      >
        <option value="">Seleccione un producto</option>
        {productos.map((producto: any) => (
          <option key={producto.id} value={producto.id}>
            {producto?.nombre || `Producto ${producto.id}`}
          </option>
        ))}
      </select>
    </>
  );
};

export { SelectCustomize };
