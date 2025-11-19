import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    if(!event.params.data.local || event.params.data.local.connect.length === 0) {
      throw new errors.ApplicationError(
        `Debe seleccionar un local.`
      );      
    }
    const localId = event.params.data.local.connect[0].id;
    //console.log("localId", localId)
    const cajaExistente = await strapi.db
      .query("api::caja-diaria.caja-diaria")
      .findOne({
        where: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          local: {
            id: localId,  // <--- acá filtrás por ID
          }
        },
        populate: true,
      });
      
    if (cajaExistente) {
      throw new errors.ApplicationError(
        `Ya existe una caja diaria creada hoy (${cajaExistente.documentId}).`
      );
    }
  },
  async beforeUpdate(event) {
    const { data } = event.params;

    const caja = await strapi.db.query("api::caja-diaria.caja-diaria").findOne({
      where: {
        documentId: data.documentId,
      },
      populate:true
    });
   
    if(!data.local || data.local.connect.length === 0 && data.local.disconnect.length > 0) {
      throw new errors.ApplicationError(
        `Debe seleccionar un local.`
      );      
    }
    
    if(data.local?.connect.length > 0 && data.local?.connect[0].id != caja.local.id) {
      throw new errors.ApplicationError(
        `No puede editar el local.`
      );      
    }

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
