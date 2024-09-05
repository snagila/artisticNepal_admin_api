import productSchema from "../schema/productSchema.js";

// CREATE A PRODUCT
export const createProduct = (productObj) => {
  return productSchema(productObj).save();
};

// GET ALL PRODUCTS
export const getProducts = () => {
  return productSchema.find({});
};

// delete a product
export const deleteProduct = (id) => {
  return productSchema.deleteOne({ _id: id });
};

// edit existing image links
export const editImageLinks = (id, imageLinks) => {
  return productSchema.updateOne({ _id: id }, { $set: { images: imageLinks } });
};
