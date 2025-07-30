import { errors } from '@strapi/utils';
const { ApplicationError } = errors;
import { factories } from '@strapi/strapi';

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const ctxBody = ctx.request.body; 
    
    if(ctxBody.productos.length == 0 ){
        throw new errors.ApplicationError('Para crear una venta como mínimo debe haber un producto.');
    }

    const productos = ctxBody.productos;
    for ( const producto of productos ){
        const productoConnect = producto.producto.connect[0];
        
        const cantidad = producto.cantidad;
        const id = productoConnect.id;
        const documentId = productoConnect.documentId;

        //console.log(`cantidad: ${cantidad}`)
        //console.log(`id: ${id}`)
        //console.log(`documentId: ${documentId}`)          

        const productoDb = await strapi.entityService.findOne('api::producto.producto', id);

        const stock = productoDb.stock;
        const nombreProducto = productoDb.nombre;
        if(cantidad > stock || cantidad == 0 ) {
            throw new errors.ApplicationError(`La cantidad supera el stock, usted dispone de ${stock} unidades de ${nombreProducto}`);
        }
        
    }

  },
};