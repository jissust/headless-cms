// import type { Core } from '@strapi/strapi';
//import fs from "fs";
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
    /** seeds - locales */
    try {
      /**
       * 1️⃣ ESTADOS DE SERVICE
       */
      const estadosCount = await strapi.db
        .query("api::estado-de-service.estado-de-service")
        .count();
      strapi.log.info(`Estado de service - cantidad: ${estadosCount}`);
      if (estadosCount === 0) {
        await strapi.db
          .query("api::estado-de-service.estado-de-service")
          .createMany({
            data: [
              { id: 1, nombre: "Pendiente", color: "#fc0000" },
              { id: 2, nombre: "Realizando", color: "#fc0000" },
              { id: 3, nombre: "Finalizado", color: "#fff000" },
              { id: 4, nombre: "Entregado", color: "#00a640" },
            ],
          });

        strapi.log.info("✔ estados_de_services creados");
      }

      /**
       * 2️⃣ FORMAS DE PAGO
       */
      const pagosCount = await strapi.db
        .query("api::forma-de-pago.forma-de-pago")
        .count();
      strapi.log.info(`Formas de pago - cantidad: ${pagosCount}`);

      if (pagosCount === 0) {
        await strapi.db.query("api::forma-de-pago.forma-de-pago").createMany({
          data: [
            { id: 1, nombre: "Efectivo" },
            { id: 2, nombre: "Transferencia" },
            { id: 3, nombre: "Tarjeta de crédito" },
            { id: 4, nombre: "Tarjeta de débito" },
          ],
        });

        strapi.log.info("✔ formas_de_pagos creadas");
      }

      /**
       * 3️⃣ LOCALS
       */
      const localsCount = await strapi.db.query("api::local.local").count();
      strapi.log.info(`Locales - cantidad: ${localsCount}`);

      if (localsCount === 0) {
        await strapi.db.query("api::local.local").createMany({
          data: [
            { id: 1, nombre: "Local uno", direccion: "example 1234" },
            { id: 2, nombre: "Local dos", direccion: "example 5678" },
          ],
        });

        strapi.log.info("✔ locals creados");
      }

      /**
       * 4️⃣ TIPOS DE MONEDA
       */
      const monedasCount = await strapi.db
        .query("api::tipo-de-moneda.tipo-de-moneda")
        .count();
      strapi.log.info(`Tipo de moneda - cantidad: ${monedasCount}`);

      if (monedasCount === 0) {
        await strapi.db.query("api::tipo-de-moneda.tipo-de-moneda").createMany({
          data: [
            { id: 1, nombre: "Pesos", codigo: "ARS", simbolo: "$" },
            { id: 2, nombre: "Dólar", codigo: "USD", simbolo: "U$S" },
          ],
        });

        strapi.log.info("✔ tipos_de_monedas creados");
      }

      /**
       * 5️⃣ TIPOS DE VENTA
       */
      const ventasCount = await strapi.db
        .query("api::tipo-de-venta.tipo-de-venta")
        .count();
      strapi.log.info(`Tipos de venta - cantidad: ${ventasCount}`);

      if (ventasCount === 0) {
        await strapi.db.query("api::tipo-de-venta.tipo-de-venta").createMany({
          data: [
            { id: 1, nombre: "venta minorista" },
            { id: 2, nombre: "venta mayorista" },
          ],
        });

        strapi.log.info("✔ tipos_de_ventas creados");
      }
    } catch (error) {
      strapi.log.error("❌ Error ejecutando seeds iniciales", error);
    }

    /**
     * 6️⃣ PDF CREATOR - TEMPLATES
     */
    const pdfTemplatesCount = await strapi.db
      .query("plugin::strapi-plugin-pdf-creator.template")
      .count();
      strapi.log.info(`Pdf template - cantidad: ${pdfTemplatesCount}`);

    if (pdfTemplatesCount === 0) {
      await strapi.db
        .query("plugin::strapi-plugin-pdf-creator.template")
        .createMany({
          data: [
            {
              id: 1,
              name: "Remito",
              collectionName: "api::remito.remito",
              enabled: true,
              flatten_document: true,
            },
            {
              id: 2,
              name: "Service",
              collectionName: "api::service.service",
              enabled: true,
              flatten_document: true,
            },
          ],
        });

      strapi.log.info("✔ PDF Creator templates creados");
    }
  },
};
