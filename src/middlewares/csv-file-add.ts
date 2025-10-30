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
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
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
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
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
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
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
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                totalGanancia += num;
              }
            }

            // --- Columna 8 => total_gasto ---
            const rawTotalGasto = cols[6];
            if (rawTotalGasto !== undefined) {
              const cleaned = rawTotalGasto.replace(/^"|"$/g, "").trim();
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
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
      // Unificamos ambos arrays
      //const merged = [...ventasHoy, ...serviceHoy];

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
        const total = item.total || 0;

        // Moneda: si no existe (como en Service), es ARS
        const moneda = item.tipo_de_moneda?.codigo || "ARS";

        // Forma de pago normalizada
        const forma = normalizeText(item.forma_de_pago?.nombre || "efectivo");

        // Sumar según moneda
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

    if (
      ctx.request.method === "GET" &&
      ctx.url.startsWith("/export-csv/export/caja-diaria")
    ) {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      let csv = `CAJA - ${new Date().toLocaleDateString()}\n\n`; //Variable en donde se van a grabar todas las lineas

      /** BLOQUE DE ENTRADA */
      /** VENTAS */
      const ventasHoy = await strapi.db.query("api::venta.venta").findMany({
        where: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        populate: ["forma_de_pago", "tipo_de_moneda"],
      });
      
      const serviceHoy = await strapi.db
        .query("api::service.service")
        .findMany({
          where: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
          populate: ["forma_de_pago"],
        });
      
      const entradasMerged = [...ventasHoy, ...serviceHoy];
      const entradasTotales = calcularTotales(entradasMerged);  
      //console.log("entradasTotales: ", entradasTotales);

      let csvEntradaVentas = "";
      csvEntradaVentas += "Concepto,Cliente,Total,Moneda,Forma de pago\n";

      for (const venta of ventasHoy) {
        const concepto = "Venta";
        const cliente = `${venta.nombre} ${venta.apellido}` || "";
        const total = venta.total || 0;
        const moneda = venta.tipo_de_moneda?.codigo || "-";
        const forma = venta.forma_de_pago?.nombre || "-";

        csvEntradaVentas += `${concepto},${cliente},${total},${moneda},${forma}\n`;
      }

      /** SERVICE */
      let csvEntradasService = "";
      for (const service of serviceHoy) {
        const concepto = `Service`;
        const cliente = `${service.cliente}` || "";
        const total = service.total || 0;
        const moneda = "ARS";
        const forma = service.forma_de_pago?.nombre || "-";

        csvEntradasService += `${concepto},${cliente},${total},${moneda},${forma}\n`;
      }

      csv += csvEntradaVentas;
      csv += csvEntradasService;

      /** BLOQUE DE SALIDA */
      let csvSalidaHeader = "\n\nConcepto,Cliente,Total,Moneda,Forma de pago\n";
      /** GASTO */
      const gastoHoy = await strapi.db.query("api::gasto.gasto").findMany({
        where: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        populate: ["tipo_de_moneda"],
      });

      let csvSalidaGasto = "";
      for (const gasto of gastoHoy) {
        const concepto = `Gasto`;
        const cliente = `${gasto.proveedor}` || "-";
        const total = gasto.total || 0;
        const moneda = gasto?.tipo_de_moneda?.codigo || "ARS";
        const forma = "Efectivo";

        csvSalidaGasto += `${concepto},${cliente},${total},${moneda},${forma}\n`;
      }

      csv += csvSalidaHeader + csvSalidaGasto;

      /** GASTO DIARIO */
      const gastoDiarioHoy = await strapi.db
        .query("api::gasto-diario.gasto-diario")
        .findMany({
          where: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
          populate: true,
        });

      let csvSalidaGastoDiario = "";
      for (const gastoDiario of gastoDiarioHoy) {
        const concepto = `Gasto Diario`;
        const cliente = `${gastoDiario.descripcion}` || "-";
        const total = gastoDiario.total || 0;
        const moneda = gastoDiario?.tipo_de_moneda?.codigo || "ARS";
        const forma = gastoDiario?.forma_de_pago?.nombre || "Efectivo";

        csvSalidaGastoDiario += `${concepto},${cliente},${total},${moneda},${forma}\n`;
      }
      const salidaMerged = [...gastoHoy, ...gastoDiarioHoy];
      const salidaTotales = calcularTotales(salidaMerged);
      //console.log("SALIDA", salidaTotales);

      csv += csvSalidaGastoDiario;
      //TABLA TOTALES POR MEDIOS DE PAGO
      const tituloTotalesPorMedioDePago = "\n\nTOTALES POR MEDIO DE PAGO\n"
      const headerTotalesPorMedioDePago = "MEDIO DE PAGO, ENTRADA EN PESOS, SALIDA EN PESOS, ENTRADA EN DOLARES, SALIDA EN DOLARES\n"
      const efectivoTotalesPorMedioDePago = `EFECTIVO, ${entradasTotales["totalEnPesosEfectivo"]}, ${salidaTotales["totalEnPesosEfectivo"]}, ${entradasTotales["totalEnDolaresEfectivo"]}, ${salidaTotales["totalEnDolaresEfectivo"]}\n`
      const transferenciaTotalesPorMedioDePago = `TRANSFERENCIA, ${entradasTotales["totalEnPesosTransferencia"]}, ${salidaTotales["totalEnPesosTransferencia"]}, ${entradasTotales["totalEnDolaresTransferencia"]}, ${salidaTotales["totalEnDolaresTransferencia"]}\n`
      const tarjetaDeDebitoTotalesPorMedioDePago = `TARJETA DE DÉBITO, ${entradasTotales["totalEnPesosTarjetaDeDebito"]}, ${salidaTotales["totalEnPesosTarjetaDeDebito"]}, ${entradasTotales["totalEnDolaresTarjetaDeDebito"]}, ${salidaTotales["totalEnDolaresTarjetaDeDebito"]}\n`
      const tarjetaDeCreditoTotalesPorMedioDePago = `TARJETA DE CRÉDITO, ${entradasTotales["totalEnPesosTarjetaDeCredito"]}, ${salidaTotales["totalEnPesosTarjetaDeCredito"]}, ${entradasTotales["totalEnDolaresTarjetaDeCredito"]}, ${salidaTotales["totalEnDolaresTarjetaDeCredito"]}\n`

      csv += tituloTotalesPorMedioDePago + headerTotalesPorMedioDePago + efectivoTotalesPorMedioDePago + transferenciaTotalesPorMedioDePago + tarjetaDeDebitoTotalesPorMedioDePago + tarjetaDeCreditoTotalesPorMedioDePago;

      ctx.set("Content-Type", "text/csv");
      ctx.set(
        "Content-Disposition",
        `attachment; filename="caja_diaria_${new Date().toISOString().split("T")[0]}.csv"`
      );
      ctx.body = csv;

      return; // importante: no llamar next() si ya respondés
    }
    await next();
  };
};
