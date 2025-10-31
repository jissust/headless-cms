import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

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
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    console.log("DATA: ", data);

    const caja = await strapi.db.query("api::caja-diaria.caja-diaria").findOne({
      where: {
        documentId: data.documentId,
      },
    });

    if (caja) {
      const createdAt = new Date(caja.createdAt);
      const now = new Date();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);

      const fueCreadaHoy = createdAt >= startOfToday && createdAt <= endOfToday;

      if(!fueCreadaHoy){
            throw new errors.ApplicationError(`No es posible editar una caja correspondiente a una fecha anterior.`);
      }
    }
  },
};
