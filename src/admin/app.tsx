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

    /** agrego boton de locales */
    const ventaInterval = setInterval(() => {
      const pathname = window.location.pathname;
      const isVentaList =
        pathname === "/admin/content-manager/collection-types/api::venta.venta";

      if (isVentaList) {
        const containerAnchor = document.querySelector(
          '[data-strapi-header="true"] div:nth-child(2) a'
        ) as HTMLElement;

        if (containerAnchor) {
          containerAnchor.remove();
        }

        const container = document.querySelector(
          '[data-strapi-header="true"] div:nth-child(2)'
        ) as HTMLElement;

        if (container && !document.getElementById("locales-buttons")) {
          const btns = document.createElement("div");
          btns.id = "locales-buttons";

          fetch("/api/locals")
            .then((res) => res.json())
            .then((data) => {
              if (!data?.data) return;
              console.log(data)
              data.data.forEach((local: any) => {
                const a = document.createElement("a");
                a.href = `/admin/content-manager/collection-types/api::venta.venta/create?localId=${local.id}`;
                a.innerText = local.nombre || `Local ${local.id}`;
                a.classList.add("boton-local");

                btns.appendChild(a);
              });

              container.appendChild(btns);
            })
            .catch((err) => {
              console.error("Error al cargar locales", err);
            });

          clearInterval(ventaInterval);
        }
      }
    }, 500);
    /** */

    /** */
    setTimeout(() => {
      const tabpanel = document.querySelector("div[role='tabpanel']");
      const lastDiv = tabpanel?.querySelectorAll('div > div')[32];
      lastDiv?.classList.add('d-none')
    }, 500);
    
    /** */
    
    const style = document.createElement("style");
    style.innerHTML = `
      nav ol li ol li:nth-child(4),
      nav ul li:nth-child(n+3),
      nav ol li span {
          display: none !important;
      }
      #main-content div:first-child div:first-child img ~ div{
        display: none !important;
      }

      nav div div img {
        background-color:red;
      }

      #locales-buttons {
        display: flex;
        gap: 10px
      }
      .boton-local {
        background-color:#E53935;
        color:#FFFFFF;
        padding: 7px 15px; 
        border-radius:4px;
        text-decoration:none;
        font-size:1.2rem;
        font-weight:600;
      }
      .d-none {
        display: none !important;
      }

      .input-customize {
        position: relative;
        border: 1px solid #dcdce4;
        border-radius: 4px;
        background: #ffffff;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding-inline-start: 16px;
        padding-inline-end: 12px;
        padding-block: 8px;
        outline: none;
        box-shadow: none;
        transition-property: border-color, box-shadow, fill;
        transition-duration: 0.2s;
        font-size:1.4rem;
      }
      .label-customize {
        font-size: 1.2rem;
        line-height: 1.33;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #32324d;
        font-weight: 600;
        padding:0 0 5px 0;
      }

      .p-1 {
        padding:10px 0;
      }

      @media (max-width: 992px) { 
        #main-content {
          margin: 0 20px !important;
          padding:0;
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
