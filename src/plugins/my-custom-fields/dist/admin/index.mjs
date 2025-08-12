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
        Input: async () => import("../_chunks/index-D-fWbRRH.mjs").then((module) => ({
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
        Input: async () => import("../_chunks/index-Cb0RWlP-.mjs").then((module) => ({
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
        Input: async () => import("../_chunks/index-BeR3W9Ru.mjs").then((module) => ({
          default: module.InputNombreLocal
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
