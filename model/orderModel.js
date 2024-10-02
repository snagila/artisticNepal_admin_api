import orderSchema from "../schema/orderSchema.js";

export const getOrder = () => {
  return orderSchema.find({});
};
