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
    function customizePath() {
      try {

        const docData = {
          nombreYApellido: {
            type: "string",
            required: true,
          },
          telefono: {
            type: "biginteger",
            required: true,
          },
          fecha: {
            type: "date",
            required: true,
            default: "2025-08-14",
          },
          descripcion: {
            type: "text",
            required: true,
          },
          precio: {
            type: "text",
            required: true,
          },
          telefonoLocal: {
            type: "string",
          },
          direccionLocal: {
            type: "text",
          },
          cantidad: {
            type: "text",
          },
        }; // field names on the PDF template must match keys
        const templateName = "Title of Document";
        const flattenDocument = true;
        /*const documentBytes = await strapi
          .plugin("strapi-plugin-pdf-creator")
          .service("service")
          .createPDF(templateBytes, docData, templateName, flattenDocument);*/
        const pdfService = strapi
          .plugin("strapi-plugin-pdf-creator")
          .service("service");

        const originalCreate = pdfService.createPDF;
        strapi.log.info("🚀 PREVIO");
        // 7) Reemplazamos (monkey patch) createPDF por una función nuestra.
        const conf = strapi.config.get(`plugin::strapi-plugin-pdf-creator`);
        pdfService.createPDF = async function (
          templateBytes, // puede venir como path (string) o bytes
          docData, // datos a inyectar en el PDF
          templateName, // nombre del archivo final
          flattenDocument // si debe “aplanarse” el form PDF
        ) {
        strapi.log.info("🚀 INGRESO");
        const templateBytes2 = fs.readFileSync(
          "/sarasa.pdf"
        );          
          return originalCreate.call(
            templateBytes2,
            docData,
            templateName,
            flattenDocument,
            conf.beautifyDate
          );
        };
      } catch (err) {
        strapi.log.debug("📺: ", err);
        // ..
      }
    }
    customizePath();
  },
};
