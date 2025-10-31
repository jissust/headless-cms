import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    // Buscamos si ya existe una caja diaria creada hoy
    const cajaExistente = await strapi.db
      .query("api::caja-diaria.caja-diaria")
      .findOne({
        where: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      });

    if (cajaExistente) {
      throw new errors.ApplicationError(
        `Ya existe una caja diaria creada hoy (${cajaExistente.documentId}).`
      );
    }

    //throw new errors.ApplicationError(`ERROR AL CREAR`);
  },
  async beforeUpdate(event) {
    throw new errors.ApplicationError(`ERROR AL EDITAR`);
  },
};
