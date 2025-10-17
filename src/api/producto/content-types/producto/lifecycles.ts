import { errors } from "@strapi/utils";

export default {
  async beforeUpdate(event) {
    const { data } = event.params;
    
    const productoDb = await strapi.db.query("api::producto.producto").findOne({
      where: { documentId: data.documentId },
      populate: true,
    });
    console.log(`data`, data)
    console.log(`productoDb`, productoDb)
    if(data.tipo_de_moneda.connect.length > 0 ){
      if(productoDb.tipo_de_moneda && productoDb.tipo_de_moneda.id !== data.tipo_de_moneda.connect[0].id){
        throw new errors.ApplicationError(`No se puede cambiar la moneda de un producto ya creado: ${productoDb.nombre}`);
      }
    }
  },
};
