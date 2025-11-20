"use strict";
const react = require("react");
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
  const ref = react.useRef(setPlugin);
  react.useEffect(() => {
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-DaWr1UN9.js")).then((module2) => ({
          default: module2.SelectCustomize
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-pogELDak.js")).then((module2) => ({
          default: module2.InputNumberCustomize
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-BmbC3AWp.js")).then((module2) => ({
          default: module2.InputNumberTotalItemCustomize
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-EJ6c7NXq.js")).then((module2) => ({
          default: module2.InputTotalVentaCustomize
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-DzWZEf3l.js")).then((module2) => ({
          default: module2.InputNombreVenta
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-BP7hUBrc.js")).then((module2) => ({
          default: module2.InputNombreLocal
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-D7jHeDo1.js")).then((module2) => ({
          default: module2.InputTotalGastosItem
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-D2QOg1rA.js")).then((module2) => ({
          default: module2.InputCantidadGastosItem
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-Zj4LEd4x.js")).then((module2) => ({
          default: module2.InputPrecioPorUnidadGastosItem
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-DaBJAo9T.js")).then((module2) => ({
          default: module2.InputTotalGastos
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-UPiuDHcn.js")).then((module2) => ({
          default: module2.SelectCustomizeGasto
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-ClUyAwDT.js")).then((module2) => ({
          default: module2.InputServiceTotalGanancia
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
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-B_HXBpob.js")).then((module2) => ({
          default: module2.TitleSection
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-number-venta-ganancia-item",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-number-venta-ganancia-item-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-number-venta-ganancia-item-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-DmtfBJ-P.js")).then((module2) => ({
          default: module2.InputNumberVentaGananciaItem
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-venta-ganancia",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-venta-ganancia-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-venta-ganancia-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-B_dfG6Qj.js")).then((module2) => ({
          default: module2.InputTotalVentaGanancia
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "input-total-generico",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "input-total-generico-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "input-total-generico-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-MwkviL5C.js")).then((module2) => ({
          default: module2.InputTotalGenerico
        }))
      },
      options: {}
    });
    app.customFields.register({
      name: "ver-caja-diaria",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: "ver-caja-diaria-label",
        defaultMessage: "label"
      },
      intlDescription: {
        id: "ver-caja-diaria-description",
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/index-DSkSiIOv.js")).then((module2) => ({
          default: module2.VerCajaDiaria
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
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("../_chunks/en-B4KWt_jN.js")) }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
module.exports = index;
