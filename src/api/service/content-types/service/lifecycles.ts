import { errors } from "@strapi/utils";

export default {
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
    (strapi as any).io.emit("respuesta", "actualizado")
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (!data.numero_de_orden) {
      event.params.data.numero_de_orden = where.id;
    }
  },
  async afterUpdate(event) {
    (strapi as any).io.emit("respuesta", "actualizado")
  }
};
