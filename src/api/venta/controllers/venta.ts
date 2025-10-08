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

      const componentsProductos = venta.Productos;
      let productos = [];
      for (const componenteProducto of componentsProductos) {
        const productoDb = await strapi.db
          .query("api::producto.producto")
          .findOne({
            where: { id: componenteProducto.productoItem },
          });

        let producto = {
          id: productoDb.id,
          nombre: productoDb.nombre,
          cantidad: componenteProducto.cantidad,
          total: componenteProducto.total,
        };

        productos.push(producto);
      }

      // Crear documento PDF
      const doc = new PDFDocument({ margin: 40, size: "A4" });

      // Guardar PDF temporalmente
      const filePath = path.join(
        strapi.dirs.static.public,
        `venta-${documentId}.pdf`
      );

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

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
      doc.fontSize(14).text("Productos", { underline: true });
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
      doc.moveDown(0.5);

      doc.font("Helvetica");

      // Filas de productos
      for (const producto of productos) {
        const y = doc.y;
        doc.text(producto.id.toString(), 50, y);
        doc.text(producto.nombre, 100, y, { width: 240 });
        doc.text(producto.cantidad.toString(), 350, y);
        doc.text(`$${producto.total.toFixed(2)}`, 430, y);
        doc.moveDown();

        // Salto de página automático
        if (doc.y > 700) {
          doc.addPage();
        }
      }

      doc.moveDown(2);
      doc.fontSize(14).text(`Total de la venta: $${venta.total.toFixed(2)}`, {
        align: "right",
      });

      // Finalizar PDF
      doc.end();

      // Esperar a que se genere el archivo antes de enviarlo
      await new Promise<void>((resolve) =>
        writeStream.on("finish", () => resolve())
      );

      ctx.set(
        "Content-disposition",
        `attachment; filename=venta-${documentId}.pdf`
      );
      ctx.set("Content-type", "application/pdf");
      ctx.body = fs.createReadStream(filePath);
    },
  })
);
