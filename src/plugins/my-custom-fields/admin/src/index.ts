import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'my-custom-field',
      pluginId: PLUGIN_ID,
      type: 'integer',
      intlLabel: {
        id: 'my-custom-fields-id-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'my-custom-fields-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/SelectCustomize').then((module) => ({
            default: module.SelectCustomize,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'my-input-number-field',
      pluginId: PLUGIN_ID,
      type: 'integer',
      intlLabel: {
        id: 'my-input-number-field-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'my-input-number-field-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputNumberCustomize').then((module) => ({
            default: module.InputNumberCustomize,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'my-input-number-total-field',
      pluginId: PLUGIN_ID,
      type: 'integer',
      intlLabel: {
        id: 'my-input-number-total-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'my-input-number-total-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputNumberTotalItemCustomize').then((module) => ({
            default: module.InputNumberTotalItemCustomize,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'my-input-number-total-venta-field',
      pluginId: PLUGIN_ID,
      type: 'integer',
      intlLabel: {
        id: 'my-input-number-total-venta-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'my-input-number-total-venta-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputTotalVentaCustomize').then((module) => ({
            default: module.InputTotalVentaCustomize,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'input-nombre-venta',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'input-nombre-venta-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'input-nombre-venta-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputNombreVenta').then((module) => ({
            default: module.InputNombreVenta,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'input-nombre-local',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'input-nombre-local-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'input-nombre-local-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputNombreLocal').then((module) => ({
            default: module.InputNombreLocal,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'input-total-gastos-item',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'input-total-gastos-item-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'input-total-gastos-item-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputTotalGastosItem').then((module) => ({
            default: module.InputTotalGastosItem,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'input-cantidad-gastos-item',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'input-cantidad-gastos-item-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'input-cantidad-gastos-item-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputCantidadGastosItem').then((module) => ({
            default: module.InputCantidadGastosItem,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'input-precio-por-unidad-gastos-item',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'input-precio-por-unidad-gastos-item-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'input-precio-por-unidad-gastos-item-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputPrecioPorUnidadGastosItem').then((module) => ({
            default: module.InputPrecioPorUnidadGastosItem,
          })),
      },
      options: {},
    });

    app.customFields.register({
      name: 'input-total-gastos',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'input-total-gastos-label',
        defaultMessage: 'label',
      },
      intlDescription: {
        id: 'input-total-gastos-id-description',
        defaultMessage: 'Select any color',
      },
      icon: {},
      components: {
        Input: async () =>
          import('./components/InputTotalGastos').then((module) => ({
            default: module.InputTotalGastos,
          })),
      },
      options: {},
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
