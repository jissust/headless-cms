import type { Schema, Struct } from '@strapi/strapi';

export interface ProductosProductos extends Struct.ComponentSchema {
  collectionName: 'components_productos_productos';
  info: {
    displayName: 'productos';
    icon: 'plus';
  };
  attributes: {
    cantidad: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-input-number-field'>;
    productoItem: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-custom-field'>;
    total: Schema.Attribute.Decimal &
      Schema.Attribute.CustomField<'plugin::my-custom-fields.my-input-number-total-field'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'productos.productos': ProductosProductos;
    }
  }
}
