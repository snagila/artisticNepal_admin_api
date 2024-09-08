import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../model/categoryModal.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import {
  deleteImagesFromCloudinary,
  upload,
  uploadImagesToCloudinary,
} from "../middlewares/imageUploader/cloudinaryImageUploader.js";

export const categoryRouter = express.Router();

// create new category
categoryRouter.post(
  "/",

  upload.array("categoryThumbnail", 1),
  adminAuth,
  async (req, res) => {
    try {
      const uploadCategoryThumbnail = await uploadImagesToCloudinary(req.files);
      const thumbnailForDb = uploadCategoryThumbnail?.map(
        (result) => result.secure_url
      );

      if (uploadCategoryThumbnail) {
        req.body.categoryThumbnail = thumbnailForDb;
        console.log("body", req.body);
        const result = await createCategory(req.body);
        if (result._id) {
          return buildSuccessResponse(
            res,
            result,
            "New Category Successfully Created"
          );
        }
      }
    } catch (error) {
      if (error.code === 11000) {
        error.message = "Category already exists.";
      }
      console.log(error.message);
      buildErrorResponse(res, error.message);
    }
  }
);

// get categories
categoryRouter.get("/", adminAuth, async (req, res) => {
  try {
    const categories = await getCategories();
    if (categories) {
      return buildSuccessResponse(res, categories, "All categories");
    }
  } catch (error) {
    console.log(error.message);
    return buildErrorResponse(res, error.message);
  }
});

// update Categories
categoryRouter.patch(
  "/edit-category/:id",
  upload.array("newThumbnail", 1),
  adminAuth,
  async (req, res) => {
    try {
      const { thumbnailToDeleteFromCloud, existingThumbnail, ...rest } =
        req.body;
      const { id } = req.params;
      let thumbnailForDb;
      if (req.files && thumbnailToDeleteFromCloud) {
        const urlPart = thumbnailToDeleteFromCloud.split("/");
        const publicIdWithFolder = urlPart
          .slice(urlPart.indexOf("upload") + 2)
          .join("/")
          .split(".")[0];
        const [deleteThumbnail, updatethumbnail] = await Promise.all([
          deleteImagesFromCloudinary(publicIdWithFolder),
          uploadImagesToCloudinary(req.files),
        ]);
        const uploaded = updatethumbnail.map((result) => result.secure_url);
        thumbnailForDb = uploaded;
      }
      if (existingThumbnail) {
        thumbnailForDb = existingThumbnail;
      }
      console.log(rest);

      const editCategory = await updateCategory(id, rest, thumbnailForDb);
      if (editCategory) {
        buildSuccessResponse(res, {}, "Category updated successfully");
        return;
      }
      return;
    } catch (error) {
      console.log(error.message);
      return buildErrorResponse(res, error.message);
    }
  }
);

// delete Category
categoryRouter.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteCategory(id);
    if (deleted) {
      buildSuccessResponse(res, {}, "Category deleted successfully");
      return;
    }
    return;
  } catch (error) {
    console.log(error.message);
    return buildErrorResponse(res, error.message);
  }
});
