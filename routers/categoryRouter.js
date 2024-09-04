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

export const categoryRouter = express.Router();

// create new category
categoryRouter.post("/", adminAuth, async (req, res) => {
  try {
    const result = await createCategory(req.body);
    if (result._id) {
      return buildSuccessResponse(
        res,
        result,
        "New Category Successfully Created"
      );
    }
  } catch (error) {
    if (error.code === 11000) {
      error.message = "Category already exists.";
    }
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

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
categoryRouter.patch("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const editCategory = await updateCategory(id, formData);
    if (editCategory) {
      buildSuccessResponse(res, {}, "Category updated successfully");
      return;
    }
    return;
  } catch (error) {
    console.log(error.message);
    return buildErrorResponse(res, error.message);
  }
});

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
