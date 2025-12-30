export default async function seedFormaDePago(strapi) {
  const pagosCount = await strapi.db
    .query("api::forma-de-pago.forma-de-pago")
    .count();

  if (pagosCount === 0) {
    await strapi.db.query("api::forma-de-pago.forma-de-pago").createMany({
      data: [
        { id: 1, nombre: "Efectivo" },
        { id: 2, nombre: "Transferencia" },
        { id: 3, nombre: "Tarjeta de crédito" },
        { id: 4, nombre: "Tarjeta de débito" },
      ],
    });

    strapi.log.info("2️⃣ ✔ formas_de_pagos creadas");
  }else{
    strapi.log.info("2️⃣ ❌ Forma de pago: la tabla ya fue cargada.");
  }
}
