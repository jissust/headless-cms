// import type { Core } from '@strapi/strapi';
import fs from "fs";
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
  bootstrap({ strapi } /*: { strapi: Core.Strapi } */) {
    strapi.log.info("🚀 Bootstrap ejecutado correctamente");
    const pdfService = strapi
      .plugin("strapi-plugin-pdf-creator")
      .service("service");

    const originalCreate = pdfService.create;

    pdfService.create = async function (ctx) {
      strapi.log.info("🚀 Entré al create del PDF (monkey patch)");

      // 🔹 Fuerzo a que siempre use mi PDF fijo
      ctx.request.body.template.file.url = "/remito_f6ae77075e.pdf";

      // 🔹 Log extra para confirmar
      strapi.log.info(
        `📂 URL reemplazada: ${ctx.request.body.template.file.url}`
      );

      return originalCreate.call(this, ctx);
    };
  },
};
