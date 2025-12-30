export default async function seedLocales(strapi) {
  const localsCount = await strapi.db.query("api::local.local").count();

  if (localsCount === 0) {
    await strapi.db.query("api::local.local").createMany({
      data: [
        { id: 1, nombre: "Local uno", direccion: "example 1234" },
        { id: 2, nombre: "Local dos", direccion: "example 5678" },
      ],
    });

    strapi.log.info("3️⃣ ✔ locals creados");
  }else{
    strapi.log.info("3️⃣ ❌ Locales: la tabla ya fue cargada.");
  }
}
