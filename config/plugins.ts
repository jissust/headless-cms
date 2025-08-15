export default () => ({
  "my-custom-fields": {
    enabled: true,
    resolve: "./src/plugins/my-custom-fields",
  },
  "strapi-plugin-pdf-creator": {
    enabled: true,
    config: {
      templates: [
        {
          uid: "api::remito.remito", // UID de tu colección
          path: "public/remito_template.pdf", // Ruta al PDF base
          fields: {
            nombre: "nombre",
            apellido: "apellido",
            telefono: "telefono",
            fecha: "fecha",
            descripcion: "descripcion",
            precio: "precio",
          },
        },
      ],
    },
  },
});
