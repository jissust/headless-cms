/**
 * venta controller
 */

import { factories } from "@strapi/strapi";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default factories.createCoreController(
  "api::venta.venta",
  ({ strapi }) => ({
    async exportPdf(ctx) {
      const { documentId } = ctx.params;
      const venta = await strapi.db.query("api::venta.venta").findOne({
        where: { documentId: documentId },
        populate: true,
      });
      
      if (!venta) {
        return ctx.notFound("Venta no encontrada");
      }

      if( !venta.tipo_de_moneda && !venta.tipo_de_moneda.simbolo) {
        return ctx.notFound("Tipo de moneda no encontrada");
      }
      let simboloMoneda = venta?.tipo_de_moneda?.simbolo;

      const componentsProductos = venta.Productos;
      let productos = [];
      for (const componenteProducto of componentsProductos) {
        const productoDb = await strapi.db
          .query("api::producto.producto")
          .findOne({
            where: { id: componenteProducto.productoItem },
          });
        let nameProduct = productoDb.nombre;
        if (productoDb.descripcion) {
          nameProduct += ` ( ${productoDb.descripcion} )`;
        }

        let producto = {
          id: productoDb.id,
          nombre: nameProduct,
          cantidad: componenteProducto.cantidad,
          total: componenteProducto.total,
        };

        productos.push(producto);
      }

      // Crear documento PDF
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        ctx.set("Content-type", "application/pdf");
        ctx.set(
          "Content-disposition",
          `attachment; filename=venta-${documentId}.pdf`
        );
        ctx.body = result;
      });

      // Agregar imagen antes del título
      const logoPath = path.join(process.cwd(), "public", "img/logo.png"); // ajustá la ruta según dónde tengas la imagen
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, {
          fit: [150, 150], // ancho máximo 300 px, mantiene proporción
          align: "center",
          valign: "top",
          x: (doc.page.width - 150) / 2, // centra la imagen horizontalmente
          y: 40, // posición vertical inicial
        });
      }

      //Mover un poco hacia abajo para que no se superponga con el título
      doc.moveDown(1);

      // --------- ENCABEZADO ---------
      doc.fontSize(20).text("Comprobante de Venta", { align: "center" });
      doc.moveDown();
      // --------- FECHA ---------
      const fechaVenta = new Date(venta.createdAt);
      const fechaFormateada = fechaVenta.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      doc.fontSize(12).text(`Fecha: ${fechaFormateada}`);
      doc.moveDown();

      // --------- DATOS DEL VENDEDOR ---------
      doc.fontSize(14).text("Datos del vendedor", { underline: true });
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .text(`Comercio: Bien Copiado`)
        .text(`Local: ${venta.local?.nombre || "-"}`)
        .text(`Dirección: ${venta.local?.direccion || "-"}`)
        .text(`Teléfono: ${venta.local?.telefono || "-"}`)
        .moveDown();

      // --------- DATOS DEL CLIENTE ---------
      doc.fontSize(14).text("Datos del comprador", { underline: true });
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .text(`Cliente: ${venta.nombre || ""} ${venta.apellido || ""}`)
        .moveDown();

      // --------- TABLA DE PRODUCTOS ---------
      doc.fontSize(12).text("Productos", { underline: true });
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const colWidths = [50, 250, 80, 100];

      // Encabezado de tabla
      doc.font("Helvetica-Bold");
      doc.text("ID", 50, tableTop);
      doc.text("Nombre", 100, tableTop);
      doc.text("Cantidad", 350, tableTop);
      doc.text("Total", 430, tableTop);
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.8);

      doc.font("Helvetica");

      // Filas de productos
      for (const producto of productos) {
        const xId = 50;
        const xNombre = 100;
        const xCantidad = 350;
        const xTotal = 430;

        const maxWidthNombre = 240;

        // ALTURA REAL DEL TEXTO DE NOMBRE (incluye descripción si la agregás)
        const heightNombre = doc.heightOfString(producto.nombre, {
          width: maxWidthNombre,
        });

        // El renglón debe tener al menos la altura del texto más alto
        const rowHeight = Math.max(heightNombre, 14);

        const startY = doc.y; // punto inicial del renglón

        // DIBUJAR COLUMNA ID
        doc.text(producto.id.toString(), xId, startY);

        // DIBUJAR COLUMNA NOMBRE (ocupa varias líneas si hace falta)
        doc.text(producto.nombre, xNombre, startY, { width: maxWidthNombre });

        // DIBUJAR COLUMNA CANTIDAD
        doc.text(producto.cantidad.toString(), xCantidad, startY);

        // DIBUJAR COLUMNA TOTAL
        doc.text(`${simboloMoneda} ${producto.total.toFixed(2)}`, xTotal, startY);

        // Después del texto: bajar a la siguiente línea de la tabla
        const endY = startY + rowHeight + 5; // pequeño padding inferior
        doc.y = endY;

        // DIBUJAR LÍNEA ROJA BAJO LA FILA
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#dcdce4").stroke();

        // Volver a negro para el texto siguiente
        //doc.strokeColor("black");

        doc.moveDown(0.5);

        // Salto de página automático
        if (doc.y > 700) {
          doc.addPage();
        }
      }

      doc.moveDown(2);
      doc.fontSize(14).text(`Total de la venta: ${simboloMoneda} ${venta.total.toFixed(2)}`, {
        align: "right",
      });

      doc.end();
    },
  })
);
