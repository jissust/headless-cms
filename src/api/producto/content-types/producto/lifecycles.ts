import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    const name = data.nombre?.trim();
    if (!data.tipo_de_moneda || data.tipo_de_moneda.connect.length === 0) {
      throw new errors.ApplicationError(`Debe seleccionar una moneda`);
    }
    const tipoDeMonedaId = data.tipo_de_moneda.connect[0].id;
    if (!data.locales || data.locales.connect.length === 0) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }
    const localId = data.locales.connect[0].id;

    const productoDbName = await strapi.db
      .query("api::producto.producto")
      .findOne({
        where: {
          nombre: name,
          tipo_de_moneda: { id: tipoDeMonedaId },
          locales: { id: localId },
        },
        populate: true,
      });

    if (productoDbName) {
      throw new errors.ApplicationError(
        `Ya existe un producto con el nombre ${name}`
      );
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

      if (
        !data.locales ||
        (data.locales.connect.length === 0 &&
          data.locales.disconnect.length > 0)
      ) {
        throw new errors.ApplicationError(`Debe seleccionar un local`);
      }

      if (data.locales.connect.length > 0) {
        if (
          productoDb.locales &&
          productoDb.locales.id !== data.locales.connect[0].id
        ) {
          throw new errors.ApplicationError(
            `No se puede cambiar el local de un producto ya creado: ${productoDb.nombre}`
          );
        }
      }
    }
  },
};
