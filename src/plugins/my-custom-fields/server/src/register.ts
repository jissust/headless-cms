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
};

export default register;
