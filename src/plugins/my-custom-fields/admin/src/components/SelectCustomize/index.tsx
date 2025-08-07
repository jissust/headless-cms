import React, { useState, useEffect } from 'react';

const SelectCustomize = (props: any, ref: any) => {
  console.log('field component loaded');
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
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

  console.log(props);
  console.log(ref);

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
