import { useEffect, useState } from 'react';

const VerCajaDiaria = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [caja, setCaja] = useState<[]>([]);
  //const [ventas, setVentas] = useState<[]>([]);
  //const [services, setServices] = useState<[]>([]);
  //const [gastos, setGastos] = useState<[]>([]);
  //const [gastosDiarios, setGastosDiarios] = useState<[]>([]);
  const [entradas, setEntradas] = useState<any[]>([]);
  const [salidas, setSalidas] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);
  const [tbodyHtml, setTbodyHtml] = useState("");

  let urlSplit = window.location.href.split('/');
  let documentId = urlSplit[urlSplit.length - 1];
  if (!documentId || documentId === 'create') return;
  useEffect(() => {
    //if (!documentId || documentId === 'create') return;
    setLoading(true);
    fetch(`/api/caja-diarias?populate=*&filters[documentId][$eq]=${documentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        setCaja(data.data[0]);
      })
      .catch((err) => {
        console.error('Error al cargar productos', err);
      })
      /*.finally(() => {
        setLoading(false);
      });*/
  }, [documentId]);

  useEffect(() => {
    if (!caja || caja.length === 0) return;

    const created = new Date(caja.createdAt);
    const startOfDay = new Date(created);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(created);
    endOfDay.setHours(23, 59, 59, 999);
    const localId = caja?.local?.id;

    const base = `&filters[local][id][$eq]=${localId}&filters[createdAt][$gte]=${startOfDay.toISOString()}&filters[createdAt][$lte]=${endOfDay.toISOString()}`;
    setLoading(true);

    Promise.all([
      fetch(`/api/ventas?populate=*&${base}`).then(r => r.json()),
      fetch(`/api/services?populate=*&${base}`).then(r => r.json()),
      fetch(`/api/gastos?populate=*&${base}`).then(r => r.json()),
      fetch(`/api/gasto-diarios?populate=*&${base}`).then(r => r.json()),
    ])
      .then(async([ventasRes, servicesRes, gastosRes, gastosDiariosRes]) => {
        const ventas = ventasRes?.data || [];
        const services = servicesRes?.data || [];
        const gastos = gastosRes?.data || [];
        const gastosDiarios = gastosDiariosRes?.data || [];

        const entradasMerged = [...ventas, ...services];
        const salidasMerged = [...gastos, ...gastosDiarios];

        setEntradas(entradasMerged);
        setSalidas(salidasMerged);

        const html = await crearTablaEntradasSalidas(entradasMerged, salidasMerged);
        setTbodyHtml(html);
      })
      .catch(err => console.error("Error cargando datos", err))
      .finally(() => setLoading(false));

  }, [caja]);

  const getProductoById = async (id: number) => {
    try {
      const res = await fetch(`/api/productos?populate=*&filters[id][$eq]=${id}&sort=nombre:desc&pagination[pageSize]=1000`);
      const data = await res.json();
      return data?.data[0] || null;
    } catch (err) {
      console.error("Error al cargar producto", err);
      return null;
    }
  };

  const crearTablaEntradasSalidas = async (entradas: any, salidas: any) => {
    let table = "";
    const maxLength = Math.max(entradas.length, salidas.length);
    console.log(maxLength)
    if(maxLength === 0 ){
      return "<tr><td colspan='8'>No hay datos registrados</td></tr>";
    }
    for (let i = 0; i < maxLength; i++) {
      const entrada = entradas[i];              
      let entradaProductos = "";
      if (entrada && entrada.Productos) {
        for (const producto of entrada.Productos) {
          const id = producto.productoItem;
          const productoDb = await getProductoById(id);
          if (productoDb) {
            entradaProductos += `<div>- ${productoDb.nombre} (x${producto.cantidad || 1})</div>`;
          }
        }
      }

      const salida = salidas[i];
      let salidaProductos = "";
      if (salida && salida.Gastos) {
        for (const producto of salida.Gastos) {
          let nombreProducto = producto.nombre_producto_nuevo;
          if (!nombreProducto) {
            const productoDb = await getProductoById(producto.producto);
            if (productoDb) {
              nombreProducto = productoDb.nombre;
            } else {
              nombreProducto = "Producto desconocido";
            }
          }
          salidaProductos += `<div>- ${nombreProducto} (x${producto.cantidad || 1})</div>`;
        }
      }

      const idEntrada = entrada ? entrada.id || "" : "";
      const tipoEntrada = entrada
        ? entrada.numero_de_orden
          ? "Service"
          : "Venta"
        : "";
      const conceptoTextoEntrada = entrada
        ? entrada.numero_de_orden
          ? `${entrada.descripcion_estado_del_equipo || ""}`
          : `${entradaProductos}`
        : "";

      const conceptoEntrada = idEntrada
        ? `(#${idEntrada}) ${tipoEntrada} ${conceptoTextoEntrada !== "" ? ": " + conceptoTextoEntrada : ""}`
        : ``;

      const totalEntrada = entrada ? entrada.total || 0 : "";
      const monedaEntrada = entrada
        ? entrada.tipo_de_moneda?.codigo || "ARS"
        : "";
      const formaEntrada = entrada
        ? entrada.forma_de_pago?.nombre || "Efectivo"
        : "";

      // Datos de salida
      const idSalida = salida ? salida.id || "" : "";
      const tipoSalida = salida
        ? salida.proveedor
          ? "Gasto"
          : "Gasto Diario"
        : "";
      const conceptoTextoSalida = salida
        ? salida.descripcion || salidaProductos
        : "";

      const conceptoSalida = idSalida
        ? `(#${idSalida}) ${tipoSalida} ${conceptoTextoSalida !== "" ? ": " + conceptoTextoSalida : ""}`
        : ``;

      const totalSalida = salida ? salida.total || 0 : "";
      const monedaSalida = salida
        ? salida.tipo_de_moneda?.codigo || "ARS"
        : "";
      const formaSalida = salida
        ? salida.forma_de_pago?.nombre || "Efectivo"
        : "";

      table += `<tr><td>${conceptoEntrada}</td><td>${totalEntrada}</td><td>${monedaEntrada}</td><td>${formaEntrada}</td><td>${conceptoSalida}</td><td>${totalSalida}</td><td>${monedaSalida}</td><td>${formaSalida}</td></tr>`;

    }
    return table;
  }
  
  if (loading) return <p>Cargando...</p>;
  if (!caja) return <p>No se encontró caja diaria.</p>;

  return <div>
    <table className="table w-100">
      <thead>
        <tr>
          <th colSpan={4}>Entradas</th>
          <th colSpan={4}>Salidas</th>
        </tr>
        <tr>
          <th scope="col">Concepto</th>
          <th scope="col">Total</th>
          <th scope="col">Moneda</th>
          <th scope="col">Forma de pago</th>
          <th scope="col">Concepto</th>
          <th scope="col">Total</th>
          <th scope="col">Moneda</th>
          <th scope="col">Forma de pago</th>
        </tr>
      </thead>
      <tbody dangerouslySetInnerHTML={{ __html: tbodyHtml }} />
    </table>
  </div>;
};

export { VerCajaDiaria };
