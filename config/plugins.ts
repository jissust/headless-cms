export default () => ({
  "my-custom-fields": {
    enabled: true,
    resolve: "./src/plugins/my-custom-fields",
  },
  "strapi-plugin-pdf-creator": {
    enabled: true,
    config: {
      beautifyDate: {
        fields: ["date"], // name of fields that will be changed
        options: {
          // check JS toLocaleDateString options for details
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      },
    },
  },
});
