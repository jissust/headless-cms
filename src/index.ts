// import type { Core } from '@strapi/strapi';

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

    // 🔧 Obtenemos el servicio del plugin
    const pdfService = strapi
      .plugin("strapi-plugin-pdf-creator")
      .service("service");

    if (pdfService) {
      const originalCreate = pdfService.createPDF;

      // 🩹 Monkey patch a la ruta que rompe en producción
      pdfService.createPDF = async function (
        templateBytes,
        docData,
        templateName,
        flattenDocument
      ) {
        if (
          typeof templateBytes === "string" &&
          templateBytes.startsWith("public")
        ) {
          strapi.log.warn(`🔧 Corrigiendo ruta de template: ${templateBytes}`);
          templateBytes = templateBytes.replace(/^public/, "");
        }

        return originalCreate.call(
          this,
          templateBytes,
          docData,
          templateName,
          flattenDocument
        );
      }

      strapi.log.info("✅ Monkey patch aplicado a strapi-plugin-pdf-creator");
    } else {
      strapi.log.error("❌ No se encontró el servicio pdfService");
    }
  },
};
