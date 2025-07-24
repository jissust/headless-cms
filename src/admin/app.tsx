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
      #main-content div:first-child div:first-child img ~ div{
        display: none !important;
      }

      nav div div img {
      background-color:red;}

      @media (max-width: 992px) { 
        #main-content {
          margin: 0 20px !important;
        }
        #main-content div:first-child {
          width:100%;
        }
        #main-content div div div:nth-child(2){
          display: block;
        }
        nav ~ div div nav {
          position: absolute !important;
          left: -100%;
        }
        .show {
          left:55px !important;
        }
        
      }

    `;
    document.head.appendChild(style);
    /* evento para ocultar/mostrar nav */
    const interval = setInterval(() => {
      const logo = document.querySelector(
        "nav > div > div > img"
      ) as HTMLElement;
      const menu = document.querySelector("nav ~ div div nav") as HTMLElement;

      if (logo) {
        logo.style.cursor = "pointer";

        logo.addEventListener("click", () => {
          const menu = document.querySelector(
            "nav ~ div div nav"
          ) as HTMLElement;
          if (menu) {
            menu.classList.toggle("show");
          }
        });

        clearInterval(interval);
      }
    }, 500);
  },
};
