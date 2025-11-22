import * as fs from "fs";
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
      let templateBytes = null;
      if (template2.file.url.startsWith("http")) {
        strapi.log.info("EN PRODUCCIÓN");
        const response = await fetch(`${template2.file.url}`);
        templateBytes = Buffer.from(await response.arrayBuffer());
      } else {
        templateBytes = fs.readFileSync(`public${template2.file.url}`);
      }

      let docData = await strapi.documents(reqData.collectionType).findFirst({
        filters: { documentId: reqData.documentId },
        populate: "*",
      });

      if (docData.local) {
        docData.tmpLocalDireccion = docData.local.direccion;
        docData.tmpLocalTel = docData.local.telefono;
      }
      if(docData.fecha){
        const [anio, mes, dia] = docData.fecha.split("-");
        docData.fecha = `${dia}/${mes}/${anio}`;
      }
      docData = await strapi
        .plugin("strapi-plugin-pdf-creator")
        .service("images")
        .BufferIamgesOnData(docData, false);

      const conf = strapi.config.get(`plugin::strapi-plugin-pdf-creator`);

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

    await next();
  };
};
