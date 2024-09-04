import productSchema from "../schema/productSchema.js";

// CREATE A PRODUCT
export const createProduct = (productObj) => {
  return productSchema(productObj).save();
};
