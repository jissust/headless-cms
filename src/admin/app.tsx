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
      if (containerAnchor && containerAnchor.classList.contains("d-none")) {
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
      if (containerAnchor && containerAnchor.classList.contains("d-none")) {
        containerAnchor.classList.remove("d-none");
      }
    }
  });

  observer.observe(document.body, {
    childList: true, // detecta nodos agregados o eliminados
    subtree: true, // detecta cambios dentro de hijos
  });
}

function bloquearBotones() {
  const observer = new MutationObserver(() => {
    // bloquear botones con aria-haspopup="menu", dentro de formularios
    const buttonsHasPopup = document.querySelectorAll(
      'form button[aria-haspopup="menu"]'
    );

    buttonsHasPopup.forEach((btn) => {
      btn.disabled = true;
      btn.style.pointerEvents = "none";
      btn.style.display = "none";
    });

    const buttonsHasDialog = document.querySelectorAll(
      'button[aria-haspopup="dialog"]'
    );
    buttonsHasDialog.forEach((btn, index) => {
      if(index == 1){
        btn.disabled = true;
        btn.style.pointerEvents = "none";
        btn.style.display = "none";
      }
    })
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
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
    translations: {
      es: {
        "HomePage.header.title": "Hola {name}",
        "HomePage.header.subtitle": "Bienvenido a su panel de administración",
        "global.home": "Página principal",
        "global.plugins.content-manager": "Gestor de contenidos",

        "content-manager.content-types.api::venta.venta.createdAt": "Creado",
        "content-manager.content-types.api::venta.venta.total": "Total",
        "content-manager.content-types.api::venta.venta.local": "Local",
        "content-manager.content-types.api::venta.venta.tipo_de_venta":
          "Tipo de venta",
        "content-manager.content-types.api::venta.venta.total_ganancia":
          "Total ganancia",
        "content-manager.content-types.api::venta.venta.apellido": "Apellido",
        "content-manager.content-types.api::venta.venta.nombre": "Nombre",
        "content-manager.content-types.api::venta.venta.id": "Id",

        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.updatedAt":
          "Editado",
        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.createdAt":
          "Creado",
        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.nombre":
          "Nombre",
        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.id":
          "Id",

        "content-manager.content-types.api::service.service.estado_de_service":
          "Estado de service",
        "content-manager.content-types.api::service.service.fecha_de_ingreso":
          "Fecha de ingreso",
        "content-manager.content-types.api::service.service.total_gasto":
          "Total gasto",
        "content-manager.content-types.api::service.service.descripcion_gasto":
          "Descripción gasto",
        "content-manager.content-types.api::service.service.email": "Email",
        "content-manager.content-types.api::service.service.id": "Id",
        "content-manager.content-types.api::service.service.title_section_estados_del_equipo":
          "Estados del equipo al ingreso",
        "content-manager.content-types.api::service.service.title_section_gastos":
          "Gastos",
        "content-manager.content-types.api::service.service.title_section_condiciones_de_servicio":
          "Condiciones de Servicio",
        "content-manager.content-types.api::service.service.title_section_observaciones_del_tecnico":
          "Observaciones del técnico",
        "content-manager.content-types.api::service.service.title_section_trabajo_solicitado_por_cliente":
          "Trabajo solicitado por el cliente",
        "content-manager.content-types.api::service.service.title_section":
          "Título de sección",
        "content-manager.content-types.api::service.service.ganancia":
          "Ganancia",
        "content-manager.content-types.api::service.service.rayaduras":
          "Rayaduras",
        "content-manager.content-types.api::service.service.otros": "Otros",
        "content-manager.content-types.api::service.service.icloud_desactivado":
          "Icloud desactivado",
        "content-manager.content-types.api::service.service.icloud_activo":
          "Icloud activo",
        "content-manager.content-types.api::service.service.golpes": "Golpes",
        "content-manager.content-types.api::service.service.pantalla_daniada":
          "Pantalla dañada",
        "content-manager.content-types.api::service.service.no_enciende":
          "No enciende",
        "content-manager.content-types.api::service.service.enciende":
          "Enciende",
        "content-manager.content-types.api::service.service.condiciones_del_servicio":
          "Condiciones del servicio",
        "content-manager.content-types.api::service.service.observaciones_del_tecnico":
          "Observaciones del técnico",
        "content-manager.content-types.api::service.service.trabajo_solicitado_por_el_cliente":
          "Trabajo solicitado por el cliente",
        "content-manager.content-types.api::service.service.imei": "IMEI",
        "content-manager.content-types.api::service.service.modelo": "Modelo",
        "content-manager.content-types.api::service.service.marca": "Marca",
        "content-manager.content-types.api::service.service.descripcion_estado_del_equipo":
          "Descripción del equipo",
        "content-manager.content-types.api::service.service.numero_de_orden":
          "N° de orden",
        "content-manager.content-types.api::service.service.cliente": "Cliente",
        "content-manager.content-types.api::service.service.comercio":
          "Comercio",
        "content-manager.content-types.api::service.service.total": "Total",
        "content-manager.content-types.api::service.service.local": "Local",
        "content-manager.content-types.api::service.service.telefono":
          "Teléfono",

        "content-manager.content-types.api::remito.remito.fecha": "Fecha",
        "content-manager.content-types.api::remito.remito.telefono": "Teléfono",
        "content-manager.content-types.api::remito.remito.nombreYApellido":
          "Nombre y apellido",
        "content-manager.content-types.api::remito.remito.id": "Id",
        "content-manager.content-types.api::remito.remito.local": "Local",
        "content-manager.content-types.api::remito.remito.cantidad": "Cantidad",
        "content-manager.content-types.api::remito.remito.precio": "Precio",
        "content-manager.content-types.api::remito.remito.descripcion":
          "Descripción",

        "content-manager.content-types.api::producto.producto.createdAt":
          "Creado",
        "content-manager.content-types.api::producto.producto.stock": "Stock",
        "content-manager.content-types.api::producto.producto.locales":
          "Locales",
        "content-manager.content-types.api::producto.producto.precio": "Precio",
        "content-manager.content-types.api::producto.producto.descripcion":
          "Descripción",
        "content-manager.content-types.api::producto.producto.nombre": "Nombre",
        "content-manager.content-types.api::producto.producto.id": "Id",
        "content-manager.content-types.api::producto.producto.precio_compra":
          "Precio compra",
        "content-manager.content-types.api::producto.producto.precio_mayorista":
          "Precio Mayorista",

        "content-manager.content-types.api::local.local.telefono": "Teléfono",
        "content-manager.content-types.api::local.local.direccion": "Dirección",
        "content-manager.content-types.api::local.local.nombre": "Nombre",
        "content-manager.content-types.api::local.local.id": "Id",
        "content-manager.content-types.api::local.local.email": "Email",

        "content-manager.content-types.api::gasto.gasto.telefono": "Teléfono",
        "content-manager.content-types.api::gasto.gasto.email": "Email",
        "content-manager.content-types.api::gasto.gasto.proveedor": "Proveedor",
        "content-manager.content-types.api::gasto.gasto.id": "Id",
        "content-manager.content-types.api::gasto.gasto.Gastos": "Gastos",
        "content-manager.content-types.api::gasto.gasto.total": "Total",

        "content-manager.content-types.api::estado-de-service.estado-de-service.descripcion":
          "Descripción",
        "content-manager.content-types.api::estado-de-service.estado-de-service.createdAt":
          "Creado",
        "content-manager.content-types.api::estado-de-service.estado-de-service.nombre":
          "Nombre",
        "content-manager.content-types.api::estado-de-service.estado-de-service.id":
          "Id",
        "content-manager.content-types.api::estado-de-service.estado-de-service.color":
          "Color",

        "content-manager.plugin.name": "Gestor de contenidos",
        User: "Usuario",
        "tipo de venta": "Tipo de ventas",
        service: "Service",
        remito: "Remitos",
        producto: "Productos",
        "PDF Templates": "PDF Templates",
        local: "Local",
        gasto: "Gastos",
        "estado de service": "Estado de service",
        venta: "Ventas",

        "app.utils.drag": "Drag",
        "productos.productos": "Productos",
        productos: "Productos",
        "gastos.gastos-items": "Gastos items",
        Gastos: "Gastos",
        gastos: "Gastos",
        "api::venta.venta": "Venta",
        "plugin::users-permissions.user": "Usuario",
        "api::tipo-de-venta.tipo-de-venta": "Tipo de venta",
        "api::service.service": "Service",
        "api::remito.remito": "Remito",
        "api::producto.producto": "Productos",
        "plugin::strapi-plugin-pdf-creator.template": "PDF Template",
        "api::local.local": "Local",
        "api::gasto.gasto": "Gastos",
        "api::estado-de-service.estado-de-service": "Estado de service",
        "content-type-builder.search.placeholder": "buscar",
        "global.more.actions": "Más",
        "app.utils.toggle": "Toggle",
        "Settings.application.header": "Encabezado",
        "review-workflows.plugin.name": "Nombre",
      },
    },
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
    bloquearBotones();
    const style = document.createElement("style");
    style.innerHTML = `
      /*nav ol li ol li:nth-child(2),*/
      nav ol li ol li:nth-child(5),
      /*nav ol li ol li:nth-child(9),
      nav ol li ol li:nth-child(10),*/
      nav ol li ol li:nth-child(11),
      nav ul li:nth-child(n+3),
      nav:not([aria-label="Pagination"]) ol li span {
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
        text-align:center;
      }
      .w-100 {
        width: 100% !important;
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
    /** agrego boton para realizar descarga de remito en ventas */
    app
      .getPlugin("content-manager")
      .injectComponent("editView", "right-links", {
        name: "venta-pdf-remito",
        Component: (props: any) => {
          const { slug } = props;

          if (slug !== "api::venta.venta") return null;

          const segments = window.location.pathname.split("/");
          const documentId = segments[segments.length - 1];

          if (documentId === "create") return null;

          return (
            <a
              className="boton-local w-100"
              href={`/api/venta/${documentId}/export-pdf`}
              target="_blank"
            >
              Remito
            </a>
          );
        },
      });
  },
};
