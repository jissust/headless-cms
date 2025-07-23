import type { StrapiApp } from "@strapi/strapi/admin";
//import './style/custom.css';

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      "es",
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    theme: {
      light: {
        colors: {
          primary100: "#FFEBEE",
          primary200: "#FFCDD2",
          primary500: "#F44336", // rojo principal
          primary600: "#E53935", // hover
          primary700: "#D32F2F", // activo

          buttonPrimary500: "#F44336",
          buttonPrimary600: "#E53935",
          buttonPrimary700: "#D32F2F",
        },
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
    const style = document.createElement("style");
    style.innerHTML = `
      nav ol li ol li:nth-child(n+3),
      nav ul li:nth-child(n+3),
      nav ol li span {
          display: none !important;
      }
    `;
    document.head.appendChild(style);
  },
};
