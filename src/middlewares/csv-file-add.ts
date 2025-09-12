export default () => {
  return async (ctx, next) => {
    let total = 0;
    let totalGanancia = 0;
    let totalGasto = 0;
    let leftover = ""; // resto parcial entre chunks
    // helper: separa por comas respetando comillas
    const splitCsvLine = (line: string) =>
      line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const processText = (text: string, apiCollectionType?: string) => {
      const data = leftover + text;
      const lines = data.split("\n");
      leftover = lines.pop() || ""; // el último puede estar incompleto
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        try {
          const cols = splitCsvLine(line);

          if (apiCollectionType === "venta") {

            // --- Columna 7 => total ---
            const rawTotal = cols[7];
            if (rawTotal !== undefined) {
              const cleaned = rawTotal.replace(/^"|"$/g, "").trim();
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                total += num;
              }
            }

            // --- Columna 8 => total_ganancia ---
            const rawGanancia = cols[8];
            if (rawGanancia !== undefined) {
              const cleaned = rawGanancia.replace(/^"|"$/g, "").trim();
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                totalGanancia += num;
              }
            }
          }

          if (apiCollectionType === "service") {
            console.log(`processText: ${apiCollectionType}`);

            // --- Columna 7 => total ---
            const rawTotal = cols[4];
            if (rawTotal !== undefined) {
              const cleaned = rawTotal.replace(/^"|"$/g, "").trim();
              const normalized = cleaned.replace(/\./g, "").replace(",", ".");
              const num = parseFloat(normalized);
              if (!Number.isNaN(num)) {
                total += num;
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
          const totalLine = `TOTAL: ,${total}\n`;
          const totalLineGanancia = `TOTAL GANANCIA: , ${totalGanancia}\n`;
          const endTotalLine = totalLine + totalLineGanancia;
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
          const totalLine = `TOTAL: ,${total}\n`;
          const totalLineGanancia = `TOTAL GANANCIA: , ${totalGanancia}\n`;
          const totalLineGasto = `TOTAL GASTO: , ${totalGasto}\n`;
          const endTotalLine = totalLine + totalLineGanancia + totalLineGasto;
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
