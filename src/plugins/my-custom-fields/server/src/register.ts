import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'my-custom-field',
    plugin: 'my-custom-fields',
    type: 'integer',
  });

  strapi.customFields.register({
    name: 'my-input-number-field',
    plugin: 'my-custom-fields',
    type: 'integer',
  });

  strapi.customFields.register({
    name: 'my-input-number-total-field',
    plugin: 'my-custom-fields',
    type: 'integer',
  });

  strapi.customFields.register({
    name: 'my-input-number-total-venta-field',
    plugin: 'my-custom-fields',
    type: 'integer',
  });

  strapi.customFields.register({
    name: 'input-nombre-venta',
    plugin: 'my-custom-fields',
    type: 'string',
  });

  strapi.customFields.register({
    name: 'input-nombre-local',
    plugin: 'my-custom-fields',
    type: 'string',
  });
};

export default register;
