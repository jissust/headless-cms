import { errors } from "@strapi/utils";

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { data } = event.params;
    const gastos = ctxBody.Gastos;

    if (!gastos || gastos.length == 0) {
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

    if (
      !data.tipo_de_moneda ||
      !data.tipo_de_moneda.connect ||
      data.tipo_de_moneda.connect.length === 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar una moneda`);
    }

    const tipoDeMonedaId = data.tipo_de_moneda.connect[0].id;

    for (const gasto of gastos) {
      const id = gasto.producto;
      const productoNuevo = gasto.nombre_producto_nuevo?.trim();
      const cantidad = gasto.cantidad;
      const precio_por_unidad = gasto.precio_por_unidad;
      const total_por_item = gasto.total_por_item;
      const tipoDeMoneda = { connect: [{ id: tipoDeMonedaId }] };

      if (id && productoNuevo) {
        throw new errors.ApplicationError(
          `Si selecciona un "Producto" existente no puede completar el campo "Nombre producto nuevo"`
        );
      }

      if (!id && !productoNuevo) {
        throw new errors.ApplicationError(
          `Debe seleccionar un "Producto" existente o completar un "Nombre producto nuevo"`
        );
      }

      /**
       * SI SE COMPLETA EL CAMPO DE NUEVO PRODUCTO VERIFICAMOS QUE NO EXISTA UN PRODUCTO CON ESE NOMBRE,
       * EN CASO QUE EXISTA, LANZAMOS UN ALERTA. SI TIENE EL MISMO NOMBRE PERO TIPO DE MONEDA O LOCAL DIFERENTE
       * SE CONSIDERA COMO OTRO PRODUCTO.
       */

      const productoDbName = await strapi.db
        .query("api::producto.producto")
        .findOne({
          where: {
            nombre: productoNuevo,
            tipo_de_moneda: { id: tipoDeMonedaId },
            locales: { id: localId },
          },
          populate: true,
        });

      if (productoDbName) {
        throw new errors.ApplicationError(
          `Ya existe un producto con el nombre ${productoNuevo}`
        );
      }

      if (id) {
        const productoDb = await strapi.entityService.findOne(
          "api::producto.producto",
          id
        );

        if (productoDb) {
          await strapi.db.query("api::producto.producto").update({
            where: { id: id },
            data: {
              documentId: productoDb.documentId,
              stock: productoDb.stock + cantidad,
              precio_compra: precio_por_unidad,
              tipo_de_moneda: tipoDeMoneda,
              locales:{ connect: [], disconnect: [] },
            },
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
              locales: event.params.data.local,
              precio_compra: precio_por_unidad,
              tipo_de_moneda: tipoDeMoneda,
            },
          });
      }
    }
    (strapi as any).io.emit("refresh", "actualizado");
  },
  async beforeUpdate(event) {
    throw new errors.ApplicationError(
      `No se puede editar una gasto una vez creado.`
    );
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { data } = event.params;
    const gastos = ctxBody.Gastos;
    const documentId = data.documentId;

    if (!documentId) {
      throw new errors.ApplicationError("No se encontró el ID del gasto");
    }
    const gastoDb = await strapi.db.query("api::gasto.gasto").findOne({
      where: { documentId },
      populate: true,
    });

    if (gastos.length == 0) {
      throw new errors.ApplicationError(
        "Para crear un gasto como mínimo debe haber un producto."
      );
    }

    const localId = gastoDb.local.id;
    if (!localId) {
      throw new errors.ApplicationError(`Debe seleccionar un local`);
    }

    const tipoDeMonedaId = gastoDb.tipo_de_moneda.id;
    /** si connect esta cargado quiere decir que se modifico la relacion */
    if (ctxBody.tipo_de_moneda.connect.length > 0) {
      if (ctxBody.tipo_de_moneda.connect[0].id !== tipoDeMonedaId) {
        throw new errors.ApplicationError(
          `No se puede cambiar la moneda de un gasto ya creado`
        );
      }
    }

    /** si connect esta vacio y disconnect esta cargado, quiere decir que se esta enviando vacio */
    if (
      ctxBody.tipo_de_moneda.connect.length === 0 &&
      ctxBody.tipo_de_moneda.disconnect.length > 0
    ) {
      throw new errors.ApplicationError(`Debe seleccionar una moneda asd`);
    }

    event.params.data.local = {
      connect: [{ id: localId }],
    };

    for (const gasto of gastos) {
      const id = gasto.producto;
      const productoNuevo = gasto.nombre_producto_nuevo?.trim();
      const cantidad = gasto.cantidad;
      const precio_por_unidad = gasto.precio_por_unidad;
      const total_por_item = gasto.total_por_item;
      const tipoDeMoneda = { connect: [{ id: tipoDeMonedaId }] };

      if (id && productoNuevo) {
        throw new errors.ApplicationError(
          `Si selecciona un "Producto" existente no puede completar el campo "Nombre producto nuevo"`
        );
      }

      if (!id && !productoNuevo) {
        throw new errors.ApplicationError(
          `Debe seleccionar un "Producto" existente o completar un "Nombre producto nuevo"`
        );
      }

      /**
       * SI SE COMPLETA EL CAMPO DE NUEVO PRODUCTO VERIFICAMOS QUE NO EXISTA UN PRODUCTO CON ESE NOMBRE,
       * EN CASO QUE EXISTA, LANZAMOS UN ALERTA. SI TIENE EL MISMO NOMBRE PERO TIPO DE MONEDA O LOCAL DIFERENTE
       * SE CONSIDERA COMO OTRO PRODUCTO.
       */

      const productoDbName = await strapi.db
        .query("api::producto.producto")
        .findOne({
          where: {
            nombre: productoNuevo,
            tipo_de_moneda: { id: tipoDeMonedaId },
            locales: { id: localId },
          },
          populate: true,
        });

      if (productoDbName) {
        throw new errors.ApplicationError(
          `Ya existe un producto con el nombre ${productoNuevo}`
        );
      }

      if (id) {
        const productoDb = await strapi.entityService.findOne(
          "api::producto.producto",
          id
        );

        if (productoDb) {
          await strapi.db.query("api::producto.producto").update({
            where: { id: id },
            data: {
              documentId: productoDb.documentId,
              stock: productoDb.stock + cantidad,
              precio_compra: precio_por_unidad,
              tipo_de_moneda: tipoDeMoneda,
            },
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
              precio_compra: precio_por_unidad,
              tipo_de_moneda: tipoDeMoneda,
            },
          });
      }
    }
  },
};
