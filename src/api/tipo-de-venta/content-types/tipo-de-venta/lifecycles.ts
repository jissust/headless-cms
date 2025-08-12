import { errors } from "@strapi/utils";
const { ApplicationError } = errors;
import { factories } from "@strapi/strapi";

export default {
  async beforeCreate(event) {
    const tiposDeVentas = await strapi.entityService.findMany(
      "api::tipo-de-venta.tipo-de-venta"
    );
    if (tiposDeVentas.length >= 2) {
      throw new errors.ApplicationError(
        `No se pueden crear más ventas: ya existen dos tipos de venta.`
      );
    }
  },
};
