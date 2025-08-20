import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { data } = event.params;
    const gastos = ctxBody.Gastos;
    
    if (gastos.length == 0) {
      throw new errors.ApplicationError(
        "Para crear un gasto como mínimo debe haber un producto."
      );
    }
    
    const localId = ctx.request.query.localId;
    if (!localId) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }

    event.params.data.local = {
      connect: [{ id: localId }],
    };

    for (const gasto of gastos) {
      const productoExistente = gasto.producto;
      const productoNuevo = gasto.nombre_producto_nuevo;
      const cantidad = gasto.cantidad;
      const precio_por_unidad = gasto.precio_por_unidad;
      const total_por_item = gasto.total_por_item;
      
      if (productoExistente && productoExistente["connect"].length > 0) {
        
        const id = productoExistente["connect"][0]["id"];
        const productoDb = await strapi.entityService.findOne(
          "api::producto.producto",
          id
        );

        if (productoDb) {
          await strapi.db.query("api::producto.producto").update({
            where: { id: id },
            data: { stock: productoDb.stock + cantidad },
          });
        }
      }

      if (productoNuevo) {
        const nuevoProducto = await strapi.db
          .query("api::producto.producto")
          .create({
            data: {
              nombre: productoNuevo,
              stock: cantidad,
              locales: localId,
            },
          });
      }
    }
  },
};
