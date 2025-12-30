export default async function seedEstadoDeService(strapi) {
  const estadosCount = await strapi.db
    .query("api::estado-de-service.estado-de-service")
    .count();

  if (estadosCount === 0) {
    await strapi.db
      .query("api::estado-de-service.estado-de-service")
      .createMany({
        data: [
          { id: 1, nombre: "Pendiente", color: "#fc0000" },
          { id: 2, nombre: "Realizando", color: "#fc0000" },
          { id: 3, nombre: "Finalizado", color: "#fff000" },
          { id: 4, nombre: "Entregado", color: "#00a640" },
        ],
      });

    strapi.log.info("1️⃣ ✔ estados_de_services creados");
  }else{
    strapi.log.info("1️⃣ ❌ Estado de service: la tabla ya fue cargada.");

  }
}
