import { errors } from "@strapi/utils";

export default {
  async beforeUpdate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body;
    const { data } = event.params;

    const productoDb = await strapi.db.query("api::producto.producto").findOne({
      where: { documentId: ctxBody.documentId },
      populate: true,
    });
    
    if(data.tipo_de_moneda.connect.length > 0 ){
      if(productoDb.tipo_de_moneda && productoDb.tipo_de_moneda.id !== data.tipo_de_moneda.connect[0].id){
        throw new errors.ApplicationError("No se puede cambiar la moneda de un producto ya creado");
      }
    }
  },
};
