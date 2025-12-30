export default async function seedTipoDeMoneda(strapi) {
  const monedasCount = await strapi.db
    .query("api::tipo-de-moneda.tipo-de-moneda")
    .count();

  if (monedasCount === 0) {
    await strapi.db.query("api::tipo-de-moneda.tipo-de-moneda").createMany({
      data: [
        { id: 1, nombre: "Pesos", codigo: "ARS", simbolo: "$" },
        { id: 2, nombre: "Dólar", codigo: "USD", simbolo: "U$S" },
      ],
    });

    strapi.log.info("4️⃣ ✔ tipos_de_monedas creados");
  }else{
    strapi.log.info("4️⃣ ❌ Tipo de moneda: la tabla ya fue cargada.");
  }
}
