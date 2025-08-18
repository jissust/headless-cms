export default (config: any, { strapi }: { strapi: typeof global.strapi }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    if (ctx.url.startsWith("/strapi-plugin-pdf-creator/create-pdf")) {
      strapi.log.info("🔄 Interceptando request de PDF Creator");

      //ctx.request.body.template.file.url = "/remito_f6ae77075e.pdf";
      const reqData = ctx.request.body?.data;
      const template2 = await strapi
        .documents(`plugin::strapi-plugin-pdf-creator.template`)
        .findOne({
          documentId: reqData.templateId,
          populate: ["file"],
        });
      console.log(template2);
      ctx.isTest = true;
      strapi.log.info(`📂 Nueva URL de template: ${ctx.request}`);
    }

    await next();
  };
};
