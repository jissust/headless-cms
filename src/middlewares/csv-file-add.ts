export default () => {
  return async (ctx, next) => {
    let total = 0; // pesos
    let totalDolares = 0;
    let totalGanancia = 0; // pesos
    let totalGananciaDolares = 0;
    let totalGasto = 0;

    //Formas de pago
    let totalEfectivo = 0;
    let totalTransferencia = 0;
    let totalTarjetaCredito = 0;
    let totalTarjetaDebito = 0;
    //formas de pago usd
    let totalEfectivoUsd = 0;
    let totalTransferenciaUsd = 0;
    let totalTarjetaCreditoUsd = 0;
    let totalTarjetaDebitoUsd = 0;

    let leftover = "";
    const splitCsvLine = (line: string) =>
      line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const normalizeText = (text: string) => {
      return text
        ?.replace(/^["']|["']$/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, "")
        .toLowerCase();
    };
    const processText = (text: string, apiCollectionType?: string) => {
      const data = leftover + text;
      const lines = data.split("\n");
      leftover = lines.pop() || ""; // el último puede estar incompleto
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        try {
          const cols = splitCsvLine(line);
          const codigoTipoMoneda = cols[9];
          const formaDePago = normalizeText(cols[10]);
          const formaDePagoService = normalizeText(cols[18]);

          if (apiCollectionType === "venta") {
            // --- Columna 7 => total ---
            const rawTotal = cols[7];

            if (rawTotal !== undefined) {
              const cleaned = rawTotal.replace(/^"|"$/g, "").trim();
              //const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const normalized = cleaned.replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                  totalDolares += num;
                } else {
                  total += num;
                }
                if (formaDePago === "efectivo") {
                  if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                    totalEfectivoUsd += num;
                  } else {
                    totalEfectivo += num;
                  }
                }
                if (formaDePago === "transferencia") {
                  if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                    totalTransferenciaUsd += num;
                  } else {
                    totalTransferencia += num;
                  }
                }
                if (formaDePago === "tarjetadedebito") {
                  if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                    totalTarjetaDebitoUsd += num;
                  } else {
                    totalTarjetaDebito += num;
                  }
                }
                if (formaDePago === "tarjetadecredito") {
                  if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                    totalTarjetaCreditoUsd += num;
                  } else {
                    totalTarjetaCredito += num;
                  }
                }
              }
            }

            // --- Columna 8 => total_ganancia ---
            const rawGanancia = cols[8];
            if (rawGanancia !== undefined) {
              const cleaned = rawGanancia.replace(/^"|"$/g, "").trim();
              //const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const normalized = cleaned.replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                  totalGananciaDolares += num;
                } else {
                  totalGanancia += num;
                }
              }
            }
          }

          if (apiCollectionType === "service") {
            // --- Columna 7 => total ---
            const rawTotal = cols[4];
            if (rawTotal !== undefined) {
              const cleaned = rawTotal.replace(/^"|"$/g, "").trim();
              //const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const normalized = cleaned.replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                total += num;
              }

              if (formaDePagoService === "efectivo") {
                totalEfectivo += num;
              }
              if (formaDePagoService === "transferencia") {
                totalTransferencia += num;
              }
              if (formaDePagoService === "tarjetadedebito") {
                totalTarjetaDebito += num;
              }
              if (formaDePagoService === "tarjetadecredito") {
                totalTarjetaCredito += num;
              }
            }

            // --- Columna 8 => ganancia ---
            const rawGanancia = cols[17];
            if (rawGanancia !== undefined) {
              const cleaned = rawGanancia.replace(/^"|"$/g, "").trim();
              //const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const normalized = cleaned.replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                totalGanancia += num;
              }
            }

            // --- Columna 8 => total_gasto ---
            const rawTotalGasto = cols[6];
            if (rawTotalGasto !== undefined) {
              const cleaned = rawTotalGasto.replace(/^"|"$/g, "").trim();
              //const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const normalized = cleaned.replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                totalGasto += num;
              }
            }
          }
        } catch (e) {
          console.error("Error parsing CSV line:", e);
        }
      }
    };

    /** API::VENTA.VENTA */
    if (
      ctx.request.method === "POST" &&
      ctx.request.path.startsWith("/export-csv/export/api::venta.venta")
    ) {
      const oldWrite = ctx.res.write;
      const oldEnd = ctx.res.end;
      // override write
      ctx.res.write = function (chunk: any, ...args: any[]) {
        try {
          const str = Buffer.isBuffer(chunk)
            ? chunk.toString("utf8")
            : String(chunk);
          processText(str, "venta");
        } catch (e) {
          console.error("csv-total write error:", e);
        }
        return oldWrite.call(this, chunk, ...args);
      };

      // override end
      ctx.res.end = function (chunk: any, ...args: any[]) {
        try {
          if (chunk) {
            const str = Buffer.isBuffer(chunk)
              ? chunk.toString("utf8")
              : String(chunk);
            processText(str, "venta");
          }

          if (leftover) {
            processText("\n", "venta"); // forzar procesamiento de lo que quedó
          }

          // línea TOTAL antes de terminar la response
          const totalLine = `\nTOTAL (ARS): ,${total}\n`;
          const totalLineGanancia = `TOTAL GANANCIA (ARS): , ${totalGanancia}\n`;
          const totalLineDolares = `TOTAL (USD): ,${totalDolares}\n`;
          const totalLineGananciaDolares = `TOTAL GANANCIA (USD): , ${totalGananciaDolares}\n\n`;

          const totalLineEfectivo = `TOTAL EFECTIVO (ARS): , ${totalEfectivo}\n`;
          const totalLineTransferencia = `TOTAL TRANSFERENCIA (ARS): , ${totalTransferencia}\n`;
          const totalLineTarjetaDeCredito = `TOTAL TARJETA DE CRÉDITO (ARS): , ${totalTarjetaCredito}\n`;
          const totalLineTarjetaDeDebito = `TOTAL TARJETA DE DÉBITO (ARS): , ${totalTarjetaDebito}\n\n`;

          const totalLineEfectivoUsd = `TOTAL EFECTIVO (USD): , ${totalEfectivoUsd}\n`;
          const totalLineTransferenciaUsd = `TOTAL TRANSFERENCIA (USD): , ${totalTransferenciaUsd}\n`;
          const totalLineTarjetaDeCreditoUsd = `TOTAL TARJETA DE CRÉDITO (USD): , ${totalTarjetaCreditoUsd}\n`;
          const totalLineTarjetaDeDebitoUsd = `TOTAL TARJETA DE DÉBITO (USD): , ${totalTarjetaDebitoUsd}\n`;

          const endTotalLine =
            totalLine +
            totalLineGanancia +
            totalLineDolares +
            totalLineGananciaDolares +
            totalLineEfectivo +
            totalLineTransferencia +
            totalLineTarjetaDeCredito +
            totalLineTarjetaDeDebito +
            totalLineEfectivoUsd +
            totalLineTransferenciaUsd +
            totalLineTarjetaDeCreditoUsd +
            totalLineTarjetaDeDebitoUsd;

          oldWrite.call(this, endTotalLine);
        } catch (e) {
          console.error("csv-total end error:", e);
        }
        return oldEnd.call(this, chunk, ...args);
      };

      //await next();
    } /*else {
      await next();
    }*/
    /** API::SERVICE.SERVICE */
    if (
      ctx.request.method === "POST" &&
      ctx.request.path.startsWith("/export-csv/export/api::service.service")
    ) {
      const oldWrite = ctx.res.write;
      const oldEnd = ctx.res.end;

      // override write
      ctx.res.write = function (chunk: any, ...args: any[]) {
        try {
          const str = Buffer.isBuffer(chunk)
            ? chunk.toString("utf8")
            : String(chunk);
          processText(str, "service");
        } catch (e) {
          console.error("csv-total write error:", e);
        }
        return oldWrite.call(this, chunk, ...args);
      };

      // override end
      ctx.res.end = function (chunk: any, ...args: any[]) {
        try {
          if (chunk) {
            const str = Buffer.isBuffer(chunk)
              ? chunk.toString("utf8")
              : String(chunk);
            processText(str, "service");
          }

          if (leftover) {
            processText("\n", "service"); // forzar procesamiento de lo que quedó
          }

          // línea TOTAL antes de terminar la response
          const totalLine = `\nTOTAL: ,${total}\n`;
          const totalLineGanancia = `TOTAL GANANCIA: , ${totalGanancia}\n`;
          const totalLineGasto = `TOTAL GASTO: , ${totalGasto}\n\n`;

          const totalLineEfectivo = `TOTAL EFECTIVO: , ${totalEfectivo}\n`;
          const totalLineTransferencia = `TOTAL TRANSFERENCIA: , ${totalTransferencia}\n`;
          const totalLineTarjetaDeCredito = `TOTAL TARJETA DE CRÉDITO: , ${totalTarjetaCredito}\n`;
          const totalLineTarjetaDeDebito = `TOTAL TARJETA DE DÉBITO: , ${totalTarjetaDebito}\n\n`;

          const endTotalLine =
            totalLine +
            totalLineGanancia +
            totalLineGasto +
            totalLineEfectivo +
            totalLineTransferencia +
            totalLineTarjetaDeCredito +
            totalLineTarjetaDeDebito;
          oldWrite.call(this, endTotalLine);
        } catch (e) {
          console.error("csv-total end error:", e);
        }
        return oldEnd.call(this, chunk, ...args);
      };

      //await next();
    } /* else {
      await next();
    }*/

    const totalsPerModule = (
      module: string,
      array: any,
      code: string,
      paymentMethod: string
    ) => {
      let total = 0;
      total = array
        .filter((v: any) => {
          const moneda = v.tipo_de_moneda?.codigo === code;
          const tieneFormaDePago = v.forma_de_pago?.nombre;
          const formaDePagoNormalizada = tieneFormaDePago
            ? normalizeText(v.forma_de_pago.nombre)
            : "";
          if (module === "service") {
            return formaDePagoNormalizada === paymentMethod;
          }
          if (module === "gasto") {
            return moneda;
          }

          return moneda && formaDePagoNormalizada === paymentMethod;
        })
        .reduce((acc: any, v: any) => acc + (v.total || 0), 0);

      return total;
    };

    const calcularTotales = (merged) => {
      // Objeto base de totales
      const totales = {
        totalEnPesos: 0,
        totalEnDolares: 0,
        totalEnPesosEfectivo: 0,
        totalEnPesosTransferencia: 0,
        totalEnPesosTarjetaDeCredito: 0,
        totalEnPesosTarjetaDeDebito: 0,
        totalEnDolaresEfectivo: 0,
        totalEnDolaresTransferencia: 0,
        totalEnDolaresTarjetaDeCredito: 0,
        totalEnDolaresTarjetaDeDebito: 0,
      };

      for (const item of merged) {
        //const cleaned = item.total.replace(/^"|"$/g, "").trim();
        //const normalized = cleaned.replace(",", ".");
        //const totalTmp = parseFloat(normalized);
        //const total = isNaN(totalTmp) ? 0 : parseFloat(totalTmp.toFixed(2));//item.total || 0;
        const total = isNaN(item.total) ? 0 : parseFloat(item.total);
        const moneda = item.tipo_de_moneda?.codigo || "ARS";
        const forma = normalizeText(item.forma_de_pago?.nombre || "efectivo");

        if (moneda === "ARS") {
          totales.totalEnPesos += total;

          switch (forma) {
            case "efectivo":
              totales.totalEnPesosEfectivo += total;
              break;
            case "transferencia":
              totales.totalEnPesosTransferencia += total;
              break;
            case "tarjetadecredito":
              totales.totalEnPesosTarjetaDeCredito += total;
              break;
            case "tarjetadedebito":
              totales.totalEnPesosTarjetaDeDebito += total;
              break;
          }
        } else if (moneda === "USD") {
          totales.totalEnDolares += total;

          switch (forma) {
            case "efectivo":
              totales.totalEnDolaresEfectivo += total;
              break;
            case "transferencia":
              totales.totalEnDolaresTransferencia += total;
              break;
            case "tarjetadecredito":
              totales.totalEnDolaresTarjetaDeCredito += total;
              break;
            case "tarjetadedebito":
              totales.totalEnDolaresTarjetaDeDebito += total;
              break;
          }
        }
      }

      return totales;
    };

    const sanitizeCSV = (text = "") => {
      if (typeof text !== "string") return "";
      const safe = text.replace(/"/g, '""');
      return `"${safe}"`;
    };
    const getProductoById = async (id: number) => {
      return strapi.db.query("api::producto.producto").findOne({
        where: {
          id: id,
        },
      });
    };

    const crearTablaEntradasSalidas = async (entradas: any, salidas: any) => {
      let csv = "";
      const titleEntradasSalidas = "ENTRADAS,,,,SALIDAS,,,,\n";
      const headerEntradasSalidas =
        "CONCEPTO,TOTAL,MONEDA,FORMA DE PAGO,CONCEPTO,TOTAL,MONEDA,FORMA DE PAGO\n";
      csv += titleEntradasSalidas + headerEntradasSalidas;

      const maxLength = Math.max(entradas.length, salidas.length);
      for (let i = 0; i < maxLength; i++) {
        const entrada = entradas[i];
        let entradaProductos = "";
        if (entrada && entrada.Productos) {
          for (const producto of entrada.Productos) {
            const id = producto.productoItem;
            const productoDb = await getProductoById(id);
            if (productoDb) {
              entradaProductos += `\n- ${productoDb.nombre} (x${producto.cantidad || 1})`;
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
            salidaProductos += `\n- ${nombreProducto} (x${producto.cantidad || 1})`;
          }
        }
        //Datos de entrada
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

        csv += `${sanitizeCSV(conceptoEntrada)},${totalEntrada},${monedaEntrada},${formaEntrada},${sanitizeCSV(conceptoSalida)},${totalSalida},${monedaSalida},${formaSalida}\n`;
      }

      return csv;
    };

    if (
      ctx.request.method === "GET" &&
      ctx.url.startsWith("/export-csv/export/caja-diaria")
    ) {
      const parts = ctx.url.split("/");
      const documentId = parts[parts.length - 1];

      /** Caja hoy */
      const cajaDiaria = await strapi.db
        .query("api::caja-diaria.caja-diaria")
        .findOne({
          where: {
            documentId: documentId,
          },
          populate: true,
        });
      
      const [year, month, day] = cajaDiaria.fecha_de_ingreso.split("-");
      const created = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
      
      const localId = cajaDiaria.local?.id;
      const nameLocal = cajaDiaria.local?.nombre;  
      const fechaCaja = new Date(created).toLocaleDateString();
      let csv = `CAJA - ${nameLocal} - ${fechaCaja}\n\n`;
      if (!cajaDiaria) {
        ctx.set("Content-Type", "text/csv; charset=utf-8");
        ctx.set("Content-Disposition", "attachment; filename=error.csv");
        ctx.body = `ERROR,No existe el documentId de la caja diaria (${documentId})`;
        ctx.status = 200;
        return;
      }
      const startOfDay = new Date(created);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(created);
      endOfDay.setHours(23, 59, 59, 999);

      /** BLOQUE DE ENTRADA */
      const ventasHoy = await strapi.db.query("api::venta.venta").findMany({
        where: {
          fecha_de_ingreso: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          local: {
            id: localId,  // <--- acá filtrás por ID
          }
        },
        populate: true,
      });
      
      const serviceHoy = await strapi.db
        .query("api::service.service")
        .findMany({
          where: {
            fecha_de_ingreso: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
            local: {
              id: localId,  // <--- acá filtrás por ID
            }
          },
          populate: true,
        });

      const entradasMerged = [...ventasHoy, ...serviceHoy];
      const entradasTotales = calcularTotales(entradasMerged);

      /** BLOQUE DE SALIDA */
      const gastoHoy = await strapi.db.query("api::gasto.gasto").findMany({
        where: {
          fecha_de_ingreso: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          local: {
            id: localId,  // <--- acá filtrás por ID
          }
        },
        populate: true,
      });

      const gastoDiarioHoy = await strapi.db
        .query("api::gasto-diario.gasto-diario")
        .findMany({
          where: {
            fecha_de_ingreso: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
            local: {
              id: localId,  // <--- acá filtrás por ID
            }
          },
          populate: true,
        });

      const salidaMerged = [...gastoHoy, ...gastoDiarioHoy];
      const salidaTotales = calcularTotales(salidaMerged);

      csv += await crearTablaEntradasSalidas(entradasMerged, salidaMerged);

      //TABLA TOTALES POR MEDIOS DE PAGO
      const tituloTotalesPorMedioDePago = "\n\nTOTALES POR MEDIO DE PAGO\n";
      const headerTotalesPorMedioDePago =
        "MEDIO DE PAGO, ENTRADA EN PESOS, SALIDA EN PESOS, ENTRADA EN DOLARES, SALIDA EN DOLARES\n";
      const efectivoTotalesPorMedioDePago = `EFECTIVO, ${entradasTotales.totalEnPesosEfectivo}, ${salidaTotales.totalEnPesosEfectivo}, ${entradasTotales.totalEnDolaresEfectivo}, ${salidaTotales.totalEnDolaresEfectivo}\n`;
      const transferenciaTotalesPorMedioDePago = `TRANSFERENCIA, ${entradasTotales.totalEnPesosTransferencia}, ${salidaTotales.totalEnPesosTransferencia}, ${entradasTotales.totalEnDolaresTransferencia}, ${salidaTotales.totalEnDolaresTransferencia}\n`;
      const tarjetaDeDebitoTotalesPorMedioDePago = `TARJETA DE DÉBITO, ${entradasTotales.totalEnPesosTarjetaDeDebito}, ${salidaTotales.totalEnPesosTarjetaDeDebito}, ${entradasTotales.totalEnDolaresTarjetaDeDebito}, ${salidaTotales.totalEnDolaresTarjetaDeDebito}\n`;
      const tarjetaDeCreditoTotalesPorMedioDePago = `TARJETA DE CRÉDITO, ${entradasTotales.totalEnPesosTarjetaDeCredito}, ${salidaTotales.totalEnPesosTarjetaDeCredito}, ${entradasTotales.totalEnDolaresTarjetaDeCredito}, ${salidaTotales.totalEnDolaresTarjetaDeCredito}\n`;

      csv +=
        tituloTotalesPorMedioDePago +
        headerTotalesPorMedioDePago +
        efectivoTotalesPorMedioDePago +
        transferenciaTotalesPorMedioDePago +
        tarjetaDeDebitoTotalesPorMedioDePago +
        tarjetaDeCreditoTotalesPorMedioDePago;

      /** RESUMEN CAJA FINAL */
      const saldoFinalPesos =
        entradasTotales.totalEnPesosEfectivo -
        salidaTotales.totalEnPesosEfectivo +
        cajaDiaria.saldo_inicial_pesos;
      const saldoFinalDolar =
        entradasTotales.totalEnDolaresEfectivo -
        salidaTotales.totalEnDolaresEfectivo +
        cajaDiaria.saldo_inicial_dolar;
        //console.log("ENTRADAS TOTALES", entradasTotales)
        //console.log("SALIDAS TOTALES", salidaTotales)
      const titleResumenFinalCaja = "\n\nRESUMEN CAJA FINAL (SOLO SE TIENE EN CUENTA EL EFECTIVO)\n";
      const headerResumenFinalCaja =
        "MONEDA, INICIAL, ENTRADAS, SALIDAS, SALDO FINAL\n";
      const pesosResumenFinalCaja = `PESOS, ${cajaDiaria.saldo_inicial_pesos},${entradasTotales.totalEnPesosEfectivo}, ${salidaTotales.totalEnPesosEfectivo}, ${saldoFinalPesos}\n`;
      const dolarResumenFinalCaja = `DOLARES, ${cajaDiaria.saldo_inicial_dolar},${entradasTotales.totalEnDolaresEfectivo}, ${salidaTotales.totalEnDolaresEfectivo}, ${saldoFinalDolar}\n`;

      csv +=
        titleResumenFinalCaja +
        headerResumenFinalCaja +
        pesosResumenFinalCaja +
        dolarResumenFinalCaja;
        
      ctx.set("Content-Type", "text/csv");
      ctx.set(
        "Content-Disposition",
        `attachment; filename="caja_diaria_${nameLocal?.trim().toLowerCase().replace(" ", "_")}_${new Date(created).toISOString().split("T")[0]}.csv"`
      );
      ctx.body = csv;

      return; // importante: no llamar next() si ya respondés
    }
    await next();
  };
};
