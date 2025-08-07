import { errors } from "@strapi/utils";
const { ApplicationError } = errors;
import { factories } from "@strapi/strapi";

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    
    if (ctxBody.Productos.length == 0) {
      throw new errors.ApplicationError(
        "Para crear una venta como mínimo debe haber un producto."
      );
    }

    const localId = ctx.request.query.localId;
    if (!localId) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }

    event.params.data.local = {
      connect: [{ id: localId }],
    };

    for (const producto of ctxBody.Productos) {
      const cantidad = producto.cantidad; 
      const id = parseInt(producto.productoItem);
     
      const productoDb = await strapi.entityService.findOne(
        "api::producto.producto",
        id
      );

      const stock = productoDb.stock;
      const nombreProducto = productoDb.nombre;
      if (cantidad > stock || cantidad == 0) {
        throw new errors.ApplicationError(
          `La cantidad supera el stock, usted dispone de ${stock} unidades de ${nombreProducto}`
        );
      }
    }
  },
  async afterCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;

    const productos = ctxBody.Productos;

    for (const producto of productos) {

      const cantidad = producto.cantidad;
      const id = parseInt(producto.productoItem);

      const productoDb = await strapi.entityService.findOne(
        "api::producto.producto",
        id
      );

      if (productoDb) {
        const stockNuevo = productoDb.stock - cantidad;

        await strapi.entityService.update("api::producto.producto", id, {
          data: {
            stock: stockNuevo < 0 ? 0 : stockNuevo,
          },
        });
      }
    }
  },
};
