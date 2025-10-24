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

    let leftover = ""; // resto parcial entre chunks
    // helper: separa por comas respetando comillas
    const splitCsvLine = (line: string) =>
      line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const normalizeText = (text: string) => {
      return text?.replace(/^["']|["']$/g, "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim()
              .replace(/\s+/g, "")
              .toLowerCase()
    }
    const processText = (text: string, apiCollectionType?: string) => {
      //console.log(text)
      const data = leftover + text;
      const lines = data.split("\n");
      leftover = lines.pop() || ""; // el último puede estar incompleto
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        try {
          const cols = splitCsvLine(line);
          const codigoTipoMoneda = cols[9];
          const formaDePago = cols[10];
          const formaDePagoService = normalizeText(cols[18]);
          console.log(
            "Service: ",
            formaDePagoService
          );

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
                if (formaDePago?.trim() === '"Efectivo"') {
                  if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                    totalEfectivoUsd += num;
                  } else {
                    totalEfectivo += num;
                  }
                }
                if (formaDePago?.trim() === '"Transferencia"') {
                  if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                    totalTransferenciaUsd += num;
                  } else {
                    totalTransferencia += num;
                  }
                }
                if (formaDePago?.trim() === '"Tarjeta de débito"') {
                  if (codigoTipoMoneda?.toUpperCase() === '"USD"') {
                    totalTarjetaDebitoUsd += num;
                  } else {
                    totalTarjetaDebito += num;
                  }
                }
                if (formaDePago?.trim() === '"Tarjeta de crédito"') {
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
            //console.log(`processText: ${apiCollectionType}`);

            // --- Columna 7 => total ---
            const rawTotal = cols[4];
            if (rawTotal !== undefined) {
              const cleaned = rawTotal.replace(/^"|"$/g, "").trim();
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                total += num;
              }

              if (formaDePagoService === 'efectivo') {
                totalEfectivo += num;
              }
              if (formaDePagoService === 'transferencia') {
                totalTransferencia += num;
              }
              if (formaDePagoService === 'tarjetadedebito') {
                totalTarjetaDebito += num;
              }
              if (formaDePagoService === 'tarjetadecredito') {
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
    await next();
  };
};
