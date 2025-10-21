import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    
    if (
      !data.tipo_de_moneda ||
      data.tipo_de_moneda.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar una moneda`);
    }
  },
  async beforeUpdate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    /** esta validación se realiza para todos los datos que no vienen de ventas. */
    if (
      !strapi.requestContext
        .get()
        .url.startsWith("/content-manager/collection-types/api::venta.venta")
    ) {
      console.log(`PASO:`, strapi.requestContext.get().url);
      const { data } = event.params;
      const productoDb = await strapi.db
        .query("api::producto.producto")
        .findOne({
          where: { documentId: data.documentId },
          populate: true,
        });
        /** en caso que se quiera volver a enviar el tipo de moneda vacio */
      if (
        ctxBody.tipo_de_moneda.connect.length === 0 &&
        ctxBody.tipo_de_moneda.disconnect.length > 0
      ) {
        throw new errors.ApplicationError(`Debe seleccionar una moneda`);
      }
      /** si se selecciono un tipo de moneda, evitar que se modifique el tipo de moneda que tiene el producto en la base de datos */
      if (data.tipo_de_moneda.connect.length > 0) {
        if (
          productoDb.tipo_de_moneda &&
          productoDb.tipo_de_moneda.id !== data.tipo_de_moneda.connect[0].id
        ) {
          throw new errors.ApplicationError(
            `No se puede cambiar la moneda de un producto ya creado: ${productoDb.nombre}`
          );
        }
      }
    }
  },
};
