import { errors } from "@strapi/utils";
const { ApplicationError } = errors;
import { factories } from "@strapi/strapi";

export default {
  async beforeCreate(event) {
    (strapi as any).io.emit("refresh", "actualizado");
  },
  async afterCreate(event) {
    
  },
  beforeUpdate(event) {
    (strapi as any).io.emit("refresh", "actualizado");
  },
};
