import React, { useState, useEffect } from 'react';

const SelectCustomizeGasto = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const queryParams = new URLSearchParams(window.location.search);
  const [productos, setProductos] = useState<any[]>([]);
  const localId = queryParams.get('localId');
  const nameSplit = name.split('.');
  const index = parseInt(nameSplit[1]);
  
  useEffect(() => {
    if (!localId) {
      let urlSplit = window.location.href.split('/');
      let documentId = urlSplit[urlSplit.length - 1];
      console.log(documentId)
      fetch(`/api/gastos?populate=*&filters[documentId][$eq]=${documentId}`)
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
    console.log(selectedId)
    onChange({
      target: { name, type: attribute.type, value: selectedId },
    });
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
    </>
  );
};

export { SelectCustomizeGasto };
