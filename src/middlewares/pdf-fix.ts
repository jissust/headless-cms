import fs from "fs";
export default (config: any, { strapi }: { strapi: typeof global.strapi }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    if (ctx.url.startsWith("/strapi-plugin-pdf-creator/create-pdf")) {
      const reqData = ctx.request.body?.data;

      const template2 = await strapi
        .documents(`plugin::strapi-plugin-pdf-creator.template`)
        .findOne({
          documentId: reqData.templateId,
          populate: ["file"],
        });
        strapi.log.info(template2)
        console.log(template2)
      if (template2.file.url.startsWith("http")) {
        //const hash = template2.file.hash;
        //const ext = template2.file.ext;
        //const urlFinal = `public/uploads/${hash}${ext}`;

        console.log("http");

        const pdfService = strapi
          .plugin("strapi-plugin-pdf-creator")
          .controller("pdfGenerator");

        const response = await fetch(`${template2.file.url}`);
        if (!response.ok) {
          throw new Error(
            `No se pudo descargar el PDF: ${response.statusText}`
          );
        }
        const templateBytes = Buffer.from(await response.arrayBuffer());

        const originalCreate = pdfService.create;
        pdfService.create = async function (ctx: any) {
          return await strapi
            .plugin("strapi-plugin-pdf-creator")
            .service("service")
            .createPDF(
              templateBytes,
              reqData,
              template2.name,
              template2.flattenDocument,
              true
            );
        };
        ctx.isTest = true;
      }
    }

    await next();
  };
};
