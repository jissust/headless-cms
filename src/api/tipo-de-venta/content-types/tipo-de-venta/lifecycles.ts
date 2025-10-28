import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const tiposDeVentas = await strapi.entityService.findMany(
      "api::tipo-de-venta.tipo-de-venta"
    );
    if (tiposDeVentas.length >= 2) {
      throw new errors.ApplicationError(
        `No se pueden crear más tipos de ventas.`
      );
    }
  },
  async beforeUpdate(event) {
    throw new errors.ApplicationError(
      `No se pueden editar los tipos de ventas.`
    );
  },
  async beforeDelete(event) {
    throw new errors.ApplicationError(`No se puede eliminar el elemento seleccionado.`);
  },
};
