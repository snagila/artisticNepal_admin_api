import categorySchema from "../schema/categorySchema.js";

export const createCategory = (formData) => {
  // category && subCategory
  return categorySchema(formData).save();
};

export const getCategories = () => {
  return categorySchema.find({});
};

// update category
export const updateCategory = (id, rest, thumbnailForDb) => {
  return categorySchema.updateOne(
    { _id: id },
    { $set: { ...rest, categoryThumbnail: thumbnailForDb } },
    { new: true }
  );
};

// delete category
export const deleteCategory = (id) => {
  return categorySchema.deleteOne({ _id: id });
};
