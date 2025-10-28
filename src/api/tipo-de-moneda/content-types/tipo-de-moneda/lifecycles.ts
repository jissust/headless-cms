import { errors } from "@strapi/utils";
//const { ApplicationError } = errors;
//import { factories } from "@strapi/strapi";

export default {
  async beforeCreate(event) {
    const tiposDeMoneda = await strapi.entityService.findMany(
      "api::tipo-de-moneda.tipo-de-moneda"
    );
    if (tiposDeMoneda.length >= 2) {
      throw new errors.ApplicationError(
        `No se pueden crear más tipos de moneda.`
      );
    }
  },
  async beforeUpdate(event) {
    throw new errors.ApplicationError(`No se pueden editar los tipos de moneda.`);
  },
  async beforeDelete(event) {
    throw new errors.ApplicationError(`No se puede eliminar el elemento seleccionado.`);
  },
};
