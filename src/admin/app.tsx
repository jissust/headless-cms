import type { StrapiApp } from "@strapi/strapi/admin";

function limpiarDuplicadosLocalesButtons(id: any) {
  const botones = document.querySelectorAll(id);
  if (botones.length > 1) {
    botones.forEach((btn, index) => {
      if (index > 0) btn.remove();
    });
  }
}

function insertarBotonesLocales() {
  limpiarDuplicadosLocalesButtons("#locales-buttons");
  if (document.getElementById("locales-buttons")) return;

  const containerAnchor = document.querySelector(
    '[data-strapi-header="true"] div:nth-child(2) a'
  ) as HTMLElement;
  
  if (containerAnchor) {
    containerAnchor.remove();
    containerAnchor.classList.add("d-none");
  }

  const container = document.querySelector(
    '[data-strapi-header="true"] div:nth-child(2)'
  ) as HTMLElement;

  if (!container) return;

  const btns = document.createElement("div");
  btns.id = "locales-buttons";

  fetch("/api/locals")
    .then((res) => res.json())
    .then((data) => {
      if (!data?.data) return;

      data.data.forEach((local: any) => {
        fetch("/api/tipo-de-ventas")
          .then((res) => res.json())
          .then((tipos) => {
            if (!tipos?.data) return;
            tipos.data.forEach((tipoDeVenta: any) => {
              const a = document.createElement("a");
              a.href = `/admin/content-manager/collection-types/api::venta.venta/create?localId=${local.id}&tipoDeVentaId=${tipoDeVenta.id}`;
              a.innerText =
                `${local.nombre} - ${tipoDeVenta.nombre}` ||
                `Local ${local.id} - ${tipoDeVenta.id}`;
              a.classList.add("boton-local");
              btns.appendChild(a);
            });
          });
      });

      container.appendChild(btns);
    });
  limpiarDuplicadosLocalesButtons("#locales-buttons");
}

function observarPaginaVentas() {
  const observer = new MutationObserver(() => {
    const pathname = window.location.pathname;
    const isVentaList =
      pathname === "/admin/content-manager/collection-types/api::venta.venta";
    if (isVentaList) {
      insertarBotonesLocales();
    } else {
      document.getElementById("locales-buttons")?.remove();
      const containerAnchor = document.querySelector(
        '[data-strapi-header="true"] div:nth-child(2) a'
      ) as HTMLElement;
      if (containerAnchor.classList.contains("d-none")) {
        containerAnchor.classList.remove("d-none");
      }
    }
  });

  observer.observe(document.body, {
    childList: true, // detecta nodos agregados o eliminados
    subtree: true, // detecta cambios dentro de hijos
  });
}

function insertarBotonesLocalesGastos() {
  limpiarDuplicadosLocalesButtons("#locales-buttons-gastos");
  if (document.getElementById("locales-buttons-gastos")) return;

  const containerAnchor = document.querySelector(
    '[data-strapi-header="true"] div:nth-child(2) a'
  ) as HTMLElement;

  if (containerAnchor) {
    containerAnchor.remove();
    containerAnchor.classList.add("d-none");
  }

  const container = document.querySelector(
    '[data-strapi-header="true"] div:nth-child(2)'
  ) as HTMLElement;

  if (!container) return;

  const btns = document.createElement("div");
  btns.id = "locales-buttons-gastos";

  fetch("/api/locals")
    .then((res) => res.json())
    .then((data) => {
      if (!data?.data) return;
      data.data.forEach((local: any) => {
        
        const a = document.createElement("a");
        a.href = `/admin/content-manager/collection-types/api::gasto.gasto/create?localId=${local.id}`;
        a.innerText = `${local.nombre}` || `Local ${local.id}`;
        a.classList.add("boton-local");
        btns.appendChild(a);
      });
      container.appendChild(btns);
    });

  limpiarDuplicadosLocalesButtons("#locales-buttons-gastos");
}

function observarPaginaGastos() {
  const observer = new MutationObserver(() => {
    const pathname = window.location.pathname;
    const isVentaList =
      pathname === "/admin/content-manager/collection-types/api::gasto.gasto";
    if (isVentaList) {
      insertarBotonesLocalesGastos();
    } else {
      document.getElementById("locales-buttons-gastos")?.remove();
      const containerAnchor = document.querySelector(
        '[data-strapi-header="true"] div:nth-child(2) a'
      ) as HTMLElement;
      if (containerAnchor.classList.contains("d-none")) {
        containerAnchor.classList.remove("d-none");
      }
    }
  });

  observer.observe(document.body, {
    childList: true, // detecta nodos agregados o eliminados
    subtree: true, // detecta cambios dentro de hijos
  });
}

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
    
    observarPaginaVentas();
    observarPaginaGastos();

    const style = document.createElement("style");
    style.innerHTML = `
      nav ol li ol li:nth-child(4),
      nav ol li ol li:nth-child(9),
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

      #locales-buttons,
      #locales-buttons-gastos {
        display: flex;
        gap: 5px
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
      h1{
        text-transform: capitalize;
      }
      .h1 {
        font-weight: 600;
        font-size: 2.5rem;
        line-height: 1.25;
      }
      .container-number-currency {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 15px;
        font-weight: bold;
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
