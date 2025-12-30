export default async function seedTipoDeVenta(strapi) {
  const ventasCount = await strapi.db
    .query("api::tipo-de-venta.tipo-de-venta")
    .count();

  if (ventasCount === 0) {
    await strapi.db.query("api::tipo-de-venta.tipo-de-venta").createMany({
      data: [
        { id: 1, nombre: "venta minorista" },
        { id: 2, nombre: "venta mayorista" },
      ],
    });

    strapi.log.info("5️⃣ ✔ tipos_de_ventas creados");
  }else{
    strapi.log.info("5️⃣ ❌ Tipo de venta: la tabla ya fue cargada.");
  }
}
