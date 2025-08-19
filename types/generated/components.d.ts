import type { Schema, Struct } from '@strapi/strapi';

export interface GastosGastosItems extends Struct.ComponentSchema {
  collectionName: 'components_gastos_gastos_items';
  info: {
    displayName: 'gastos-items';
    icon: 'plus';
  };
  attributes: {
    cantidad: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    nombre_producto_nuevo: Schema.Attribute.String;
    precio_por_unidad: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    producto: Schema.Attribute.Relation<'oneToOne', 'api::producto.producto'>;
    total_por_item: Schema.Attribute.Decimal;
  };
}

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
      'gastos.gastos-items': GastosGastosItems;
      'productos.productos': ProductosProductos;
    }
  }
}
