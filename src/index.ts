//import fs from "fs";
//import path from "path";
import seedPdfTemplates from '../seeds/seed-pdf';
import seedTipoDeVenta from '../seeds/seed-tipo-de-venta';
import seedTipoDeMoneda from '../seeds/seed-tipo-de-moneda';
import seedLocales from '../seeds/seed-locales';
import seedFormaDePago from '../seeds/seed-forma-de-pago';
import seedEstadoDeService from '../seeds/seed-estado-service';
import { Server } from "socket.io";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // buscamos el controller del plugin
    const exportCtrl = strapi.plugin("export-csv").controller("export");

    const originalStreamCsv = exportCtrl.streamCsv;

    // reemplazamos la función
    exportCtrl.streamCsv = async (ctx) => {
      console.log("👉 Interceptando export CSV");

      // ejecutamos la función original, que escribe en ctx.res (stream)
      await originalStreamCsv(ctx);

      // ahora podemos interceptar el body de la respuesta
      // pero como es un stream, necesitamos enganchar el write()
      const oldWrite = ctx.res.write;

      ctx.res.write = function (chunk, ...args) {
        let str = chunk.toString("utf8");

        // solo si es la última parte del CSV, agregamos una fila extra
        if (str.endsWith("\n")) {
          str += "TOTAL,12345\n"; // <- acá metés tu fila extra
        }

        return oldWrite.call(this, str, ...args);
      };
    };

    const io = new Server(strapi.server.httpServer, {
      cors: { origin: "*" },
    });

    strapi.io = io;

    io.on("connection", (socket) => {
      strapi.log.info(`🔌 Cliente conectado: ${socket.id}`);
      socket.on("disconnect", () => {
        strapi.log.info(`❌ Cliente desconectado: ${socket.id}`);
      });
    });

    /** seeds */
    try {
      /**
       * 1️⃣ ESTADOS DE SERVICE
       */
      await seedEstadoDeService(strapi)
      /**
       * 2️⃣ FORMAS DE PAGO
       */
      await seedFormaDePago(strapi)
      /**
       * 3️⃣ LOCALS
       */
      await seedLocales(strapi)
      /**
       * 4️⃣ TIPOS DE MONEDA
       */
      await seedTipoDeMoneda(strapi)
      /**
       * 5️⃣ TIPOS DE VENTA
       */
      await seedTipoDeVenta(strapi)
      /**
       * 6️⃣ PDF CREATOR - TEMPLATES
       */
      await seedPdfTemplates(strapi)
      
    } catch (error) {
      strapi.log.error("❌ Error ejecutando seeds iniciales", error);
    }
  },
};
