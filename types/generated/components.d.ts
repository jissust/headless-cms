import type { Schema, Struct } from '@strapi/strapi';

export interface AsdItemProductos extends Struct.ComponentSchema {
  collectionName: 'components_asd_item_productos';
  info: {
    displayName: 'item productos';
    icon: 'alien';
  };
  attributes: {};
}

export interface AsdProducto extends Struct.ComponentSchema {
  collectionName: 'components_asd_productos';
  info: {
    displayName: 'producto';
  };
  attributes: {};
}

export interface ProductosProductos extends Struct.ComponentSchema {
  collectionName: 'components_productos_productos';
  info: {
    displayName: 'productos';
    icon: 'shoppingCart';
  };
  attributes: {
    cantidad: Schema.Attribute.Integer & Schema.Attribute.Required;
    producto: Schema.Attribute.Relation<'oneToOne', 'api::producto.producto'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'asd.item-productos': AsdItemProductos;
      'asd.producto': AsdProducto;
      'productos.productos': ProductosProductos;
    }
  }
}
