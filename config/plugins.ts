import { config } from "process";

export default () => ({
  "my-custom-fields": {
    enabled: true,
    resolve: "./src/plugins/my-custom-fields",
  },
  "strapi-plugin-pdf-creator": {
    enabled: true,
    config: {
      beautifyDate: {
        fields: ["date"], // name of fields that will be changed
        options: {
          // check JS toLocaleDateString options for details
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      },
    },
  },
  "export-csv": {
    enabled: true,
    config: {
      headerTransforms: {
        createdAt: "Fecha de creación",
        updatedAt: "Fecha de actualización",
        tipo_de_venta: "Tipo de venta",
        estado_de_service: "Estado del service",
        total_ganancia: "Total ganancia",
        total: "Total",
        local: "Local",
        descripcion_gasto: "Descripción del gasto",
        total_gasto: "Total gasto",
        comercio: "Comercio",
        cliente: "Cliente",
        fecha_de_ingreso: "Fecha de ingreso",
        numero_de_orden: "Número de orden",
        marca: "Marca",
        modelo: "Modelo",
        imei: "IMEI",
        trabajo_solicitado_por_el_cliente: "Trabajo solicitado por el cliente",
        observaciones_del_tecnico: "Observaciones del técnico",
        condiciones_del_servicio: "Condiciones del servicio",
        descripcion_estado_del_equipo: "Descripción estado del equipo",
        gastos: "Gastos",
        ganancia: "Ganancia",
        apellido: "Apellido",
        nombre: "Nombre",
        telefono: "Teléfono",
        email: "Email",
        dni: "DNI",

      },
      fieldTransforms: {
        local: (value: any) => value?.nombre ?? "",
        tipo_de_moneda: (value: any) => value?.codigo ?? "",
        estado_de_service: (value: any) => value?.nombre ?? "",
        tipo_de_venta: (value: any) => value?.nombre ?? "",
        createdAt: (value: any) => {
          if (!value) return "";
          const date = new Date(value);
          return date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
        fecha_de_ingreso: (value: any) => {
          if (!value) return "";
          const date = new Date(value);
          return date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
      },
      contentTypes: {
        "api::venta.venta": {
          excludedColumns: [
            "createdBy",
            "documentId",
            "updatedBy",
            "updatedAt",
            "publishedAt",
            "locale",
            "localizations",
            "nombre_venta",
            "nombre_local",
            "Productos",
          ],
        },
        "api::service.service": {
          excludedColumns: [
            "createdBy",
            "documentId",
            "updatedBy",
            "updatedAt",
            "publishedAt",
            "locale",
            "localizations",
            "enciende",
            "no_enciende",
            "pantalla_daniada",
            "golpes",
            "icloud_activo",
            "icloud_desactivado",
            "otros",
            "rayaduras",
            "title_section",
            "title_section_trabajo_solicitado_por_cliente",
            "title_section_observaciones_del_tecnico",
            "title_section_condiciones_de_servicio",
            "title_section_gastos",
            "title_section_estados_del_equipo",
            "condiciones_del_servicio",
            "createdAt"
          ],
        },
      },
    },
  },
});
