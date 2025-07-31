import type { Schema, Struct } from '@strapi/strapi';

export interface ProductosProductos extends Struct.ComponentSchema {
  collectionName: 'components_productos_productos';
  info: {
    displayName: 'productos';
    icon: 'plus';
  };
  attributes: {
    cantidad: Schema.Attribute.Integer;
    producto: Schema.Attribute.Relation<'oneToOne', 'api::producto.producto'>;
    total: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'productos.productos': ProductosProductos;
    }
  }
}
