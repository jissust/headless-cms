"use strict";
const bootstrap = ({ strapi }) => {
};
const destroy = ({ strapi }) => {
};
const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "my-custom-field",
    plugin: "my-custom-fields",
    type: "integer"
  });
  strapi.customFields.register({
    name: "my-input-number-field",
    plugin: "my-custom-fields",
    type: "integer"
  });
  strapi.customFields.register({
    name: "my-input-number-total-field",
    plugin: "my-custom-fields",
    type: "integer"
  });
  strapi.customFields.register({
    name: "my-input-number-total-venta-field",
    plugin: "my-custom-fields",
    type: "integer"
  });
  strapi.customFields.register({
    name: "input-nombre-venta",
    plugin: "my-custom-fields",
    type: "string"
  });
  strapi.customFields.register({
    name: "input-nombre-local",
    plugin: "my-custom-fields",
    type: "string"
  });
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("my-custom-fields").service("service").getWelcomeMessage();
  }
});
const controllers = {
  controller
};
const middlewares = {};
const policies = {};
const contentAPIRoutes = [
  {
    method: "GET",
    path: "/",
    // name of the controller file & the method.
    handler: "controller.index",
    config: {
      policies: []
    }
  }
];
const routes = {
  "content-api": {
    type: "content-api",
    routes: contentAPIRoutes
  }
};
const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  }
});
const services = {
  service
};
const index = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares
};
module.exports = index;
