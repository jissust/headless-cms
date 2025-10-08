/**
 * venta controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::venta.venta",
  ({ strapi }) => ({
    async exportPdf(ctx) {
      const { documentId } = ctx.params;
      const venta = await strapi.db.query("api::venta.venta").findOne({
        where: { documentId: documentId },
        populate: true,
      });
      
      const componentsProductos = venta.Productos;
      let productos = [];
      for (const componenteProducto of componentsProductos) {
        const productoDb = await strapi.db
          .query("api::producto.producto")
          .findOne({
            where: { id: componenteProducto.productoItem }
          });

        let producto = {
          id: productoDb.id,
          nombre: productoDb.nombre,
          cantidad: componenteProducto.cantidad,
          total: componenteProducto.total,
        };

        productos.push(producto); 
      }
      console.log(venta);
      console.log(productos);
    },
  })
);
