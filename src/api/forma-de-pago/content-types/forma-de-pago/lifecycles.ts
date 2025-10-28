import { errors } from "@strapi/utils";
//const { ApplicationError } = errors;
//import { factories } from "@strapi/strapi";

export default {
  async beforeCreate(event) {
    const formasDePago = await strapi.entityService.findMany(
      "api::forma-de-pago.forma-de-pago"
    );
    if (formasDePago.length >= 4) {
      throw new errors.ApplicationError(
        `No se pueden crear más formas de pago`
      );
    }
  },
  async beforeUpdate(event) {
    throw new errors.ApplicationError(`No se pueden editar las formas de pago`);
  },
  async beforeDelete(event) {
    throw new errors.ApplicationError(
      `No se puede eliminar el elemento seleccionado.`
    );
  },
};
