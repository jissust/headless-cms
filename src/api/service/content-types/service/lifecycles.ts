import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    console.log(data);
    if (
      !data.local ||
      data.local.length === 0 ||
      data.local.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un local.`);
    }

    if (
      !data.estado_de_service ||
      data.estado_de_service.length === 0 ||
      data.estado_de_service.connect.length === 0
    ) {
      throw new errors.ApplicationError(
        `Debe seleccionar un estado para el servicio técnico.`
      );
    }

    if (
      !data.forma_de_pago ||
      data.forma_de_pago.length === 0 ||
      data.forma_de_pago.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar una forma de pago.`);
    }
  },
  async afterCreate(event) {
    const { result } = event;
    console.log("Service creado:", result.id);
    if (!result.numero_de_orden) {
      await strapi.db.query("api::service.service").update({
        where: { id: result.id },
        data: { numero_de_orden: result.id },
      });
      console.log(`✅ numero_de_orden asignado al crear: ${result.id}`);
    }
    (strapi as any).io.emit("respuesta", "actualizado");
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;
    
    if (data.local.connect.length === 0 && data.local.disconnect.length > 0) {
      throw new errors.ApplicationError(`Debe seleccionar un local.`);
    }
    if (data.local.connect.length > 0 && data.local.disconnect.length > 0) {
      if (data.local.connect[0].id  !== data.local.disconnect[0].id) {
        throw new errors.ApplicationError(`No se puede editar el local.`);
      }
    }
    if (
      data.estado_de_service.connect.length === 0 &&
      data.estado_de_service.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar un estado.`);
    }
    if (
      data.forma_de_pago.connect.length === 0 &&
      data.forma_de_pago.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar una forma de pago.`);
    }
    if (data.forma_de_pago.connect.length > 0 && data.forma_de_pago.disconnect.length > 0) {
      if (data.forma_de_pago.connect[0].id  !== data.forma_de_pago.disconnect[0].id) {
        throw new errors.ApplicationError(`No se puede editar la forma de pago.`);
      }
    }

    if (!data.numero_de_orden) {
      event.params.data.numero_de_orden = where.id;
    }
  },
  async afterUpdate(event) {
    (strapi as any).io.emit("respuesta", "actualizado");
  },
};
