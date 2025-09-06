import { useRef, useEffect } from "react";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "my-custom-fields";
const Initializer = ({ setPlugin }) => {
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const index = {
  register(app) {
    app.customFields.register({
      name: "my-custom-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-custom-fields-id-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-custom-fields-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-C9j_YOYf.mjs").then((module) => ({
          default: module.SelectCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "my-input-number-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-input-number-field-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-input-number-field-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-BZ2FoXdE.mjs").then((module) => ({
          default: module.InputNumberCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "my-input-number-total-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-input-number-total-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-input-number-total-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-DcDpN9Dx.mjs").then((module) => ({
          default: module.InputNumberTotalItemCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "my-input-number-total-venta-field",
      pluginId: PLUGIN_ID,
      type: "integer",
      intlLabel: {
        id: "my-input-number-total-venta-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "my-input-number-total-venta-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-BsbbBqvj.mjs").then((module) => ({
          default: module.InputTotalVentaCustomize
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-nombre-venta",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-nombre-venta-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-nombre-venta-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-Bj59QtbH.mjs").then((module) => ({
          default: module.InputNombreVenta
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-nombre-local",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-nombre-local-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-nombre-local-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-BgQyltPX.mjs").then((module) => ({
          default: module.InputNombreLocal
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-gastos-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-gastos-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-gastos-item-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-xwof3UkE.mjs").then((module) => ({
          default: module.InputTotalGastosItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-cantidad-gastos-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-cantidad-gastos-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-cantidad-gastos-item-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-BPg5BWA0.mjs").then((module) => ({
          default: module.InputCantidadGastosItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-precio-por-unidad-gastos-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-precio-por-unidad-gastos-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-precio-por-unidad-gastos-item-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-Ylr-BL2I.mjs").then((module) => ({
          default: module.InputPrecioPorUnidadGastosItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-gastos",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-gastos-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-gastos-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-Bi8G9_t8.mjs").then((module) => ({
          default: module.InputTotalGastos
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "select-customize-gasto",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "select-customize-gasto-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "select-customize-gasto-id-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-CGK04Tyb.mjs").then((module) => ({
          default: module.SelectCustomizeGasto
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-service-total-ganancia",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-service-total-ganancia-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-service-total-ganancia-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-BH3SE1C5.mjs").then((module) => ({
          default: module.InputServiceTotalGanancia
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "title-section",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "title-section-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "title-section-description",
        defaultMessage: "Select any color"
      },
      icon: {},
      components: {
        Input: async () => import("../_chunks/index-D6xlgTMB.mjs").then((module) => ({
          default: module.TitleSection
        }))
      },
      options: {}
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("../_chunks/en-Byx4XI2L.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
export {
  index as default
};
