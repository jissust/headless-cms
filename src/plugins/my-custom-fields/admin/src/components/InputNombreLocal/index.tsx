import { get } from 'node:https';
import { useState, useEffect } from 'react';

const InputNombreLocal = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [nombreLocal, setNombreLocal] = useState<string>('');
  const url = window.location.href;
  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get('localId');

  if (localId) {
    fetch(`/api/locals?filters[id][$eq]=${localId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) {
          console.error('Debe seleccionar un local');
          return;
        }
        setNombreLocal(data.data[0].nombre);
      })
      .catch((err) => {
        console.error('Error al cargar el local', err);
      });
  } else {
    const pathParts = url.split('/');
    const ventaId = pathParts[pathParts.length - 1];

    fetch(`/api/ventas?populate=*&filters[documentId][$eq]=${ventaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) {
          console.error('Debe seleccionar una venta');
          return;
        }
        setNombreLocal(data.data[0]?.local?.nombre);
      })
      .catch((err) => {
        console.error('Error al cargar la venta', err);
      });
  }

  /*useEffect(() => {
    const observer = new MutationObserver(() => {
      getTotals('.input_total_item_product', 'total');
      getTotals('.input_ganancia_item_product', 'total_ganancia');
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const getTotals = (totalsInput: string, totalsName: string) => {
    const totals = document.querySelectorAll(totalsInput);
    let total = 0;

    if(totals.length > 0) {
      for (const input of totals) {
        const val = parseFloat((input as HTMLInputElement).value);
        if (!isNaN(val)) {
          total += val;
        }
      }
      
      onChange({
          target: {
            name: totalsName,
            type: 'number',
            value: total,
          },
        });
    }  
  };*/

  return (
    <>
      <input
        name={name}
        disabled={true}
        required={required}
        value={nombreLocal}
        type="text"
        className="input-customize"
      />
    </>
  );
};

export { InputNombreLocal };
