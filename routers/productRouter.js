import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  upload,
  uploadImagesToCloudinary,
} from "../middlewares/imageUploader/cloudinaryImageUploader.js";
import {
  createProduct,
  deleteProduct,
  editImageLinks,
  getProducts,
} from "../model/productModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";

export const productRouter = express.Router();

// create product
productRouter.post(
  "/",
  adminAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (req.files?.length > 0) {
        const uploadResults = await uploadImagesToCloudinary(req.files);

        const uploadedImages = uploadResults.map((result) => result.secure_url);
        // console.log(uploadedImages);
        if (uploadedImages) {
          req.body.images = uploadedImages;
          const createdProduct = await createProduct(req.body);

          createdProduct?._id
            ? buildSuccessResponse(
                res,
                createdProduct,
                "Product  added Successfully."
              )
            : buildErrorResponse(res, error.message);
        }

        return;
      }
    } catch (error) {
      buildErrorResponse(res, error.message);
      console.log(error.message);
    }
  }
);

// // GET ALL PRODUCTS
productRouter.get("/", adminAuth, async (req, res) => {
  try {
    const products = await getProducts();
    // console.log(products);
    if (products?.length) {
      return buildSuccessResponse(res, products, "");
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

// delete a product
productRouter.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProduct(id);
    if (deletedProduct) {
      buildSuccessResponse(res, null, "Product Deleted.");
    }
  } catch (error) {
    console.log(error);
    buildErrorResponse(
      res,
      "Sorry could not delete product. \n Please try again."
    );
  }
});

// edit a product
productRouter.patch("/edit-product/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { existingImages } = req.body;
    const checkExistingImages = await editImageLinks(id, existingImages);
  } catch (error) {
    console.log(error);
    buildErrorResponse(
      res,
      "Sorry! Could not edit the product. Please try again."
    );
  }
});
