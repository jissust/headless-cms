import { useState } from 'react';

const InputNombreVenta = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  const [nombreVenta, setNombreVenta] = useState<string>('');

  const queryParams = new URLSearchParams(window.location.search);
  const tipoDeVentaId = queryParams.get('tipoDeVentaId');

  fetch(`/api/tipo-de-ventas?filters[id][$eq]=${tipoDeVentaId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data?.data) {
        console.error('Debe seleccionar un tipo de venta');
        return;
      }
      setNombreVenta(data.data[0].nombre);
    })
    .catch((err) => {
      console.error('Error al cargar tipo de venta', err);
    });

  return (
    <>
      <input
        name={name}
        disabled={true}
        required={required}
        value={nombreVenta}
        type="text"
        className="input-customize"
      />
    </>
  );
};

export { InputNombreVenta };
