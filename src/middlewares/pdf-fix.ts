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

      if (template2.file.url.startsWith("http")) {
        strapi.log.info("EN PRODUCCIÓN")
        const response = await fetch(
          `https://sublime-happiness-a3285d84ce.media.strapiapp.com/remito_f6ae77075e.pdf`
        );
        const templateBytes = Buffer.from(await response.arrayBuffer());

        let docData = await strapi.documents(reqData.collectionType).findFirst({
          filters: { documentId: reqData.documentId },
          populate: "*",
        });
        docData = await strapi
          .plugin("strapi-plugin-pdf-creator")
          .service("images")
          .BufferIamgesOnData(docData, false);
        console.log(docData);

        const conf = strapi.config.get(`plugin::strapi-plugin-pdf-creator`);
        console.log(conf["beautifyDate"]);
        const genDoc = await strapi
          .plugin("strapi-plugin-pdf-creator")
          .service("service")
          .createPDF(
            templateBytes,
            docData,
            template2.name,
            template2.flattenDocument,
            conf["beautifyDate"]
          );

        ctx.res.writeHead(200, {
          "Content-Length": Buffer.byteLength(genDoc),
          "Content-Type": "application/pdf",
          "Content-disposition": `attachment; filename=remito.pdf`,
        });
        ctx.res.end(genDoc);

        return;
      }
    }

    await next();
  };
};
