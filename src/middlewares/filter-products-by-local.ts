
export default (config: any, { strapi }: { strapi: typeof global.strapi }) => {
    return async (ctx: any, next: () => Promise<any>) => {
    if (
      ctx.url.startsWith(
        '/content-manager/relations/productos.productos/producto'
      )
    ) {
      const localId = ctx.query.localId;

      ctx.query = {
        ...ctx.query,
        filters: {
          ...(ctx.query.filters || {}),
          locales: { id: { $eq: localId } },
        },
      };
    }

    await next();
  };
};
