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
