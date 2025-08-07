import React, { useState, useEffect } from 'react';

const SelectCustomize = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [productos, setProductos] = useState<any[]>([]);
  
  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get('localId');
    
  useEffect(() => {
    fetch(`/api/productos?populate=*&filters[locales][id][$eq]=${localId}`)
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
    onChange({
      target: { name, type: attribute.type, value: e.target.value },
    });
  };

  return (
    <>
      <label htmlFor={name}>{intlLabel?.defaultMessage || name}</label>
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
