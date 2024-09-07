import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  deleteImagesFromCloudinary,
  upload,
  uploadImagesToCloudinary,
} from "../middlewares/imageUploader/cloudinaryImageUploader.js";
import {
  createProduct,
  deleteProduct,
  editProuct,
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

    if (products?.length) {
      return buildSuccessResponse(res, products, "");
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

// delete a product
productRouter.post("/delete/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;

    const urlParts = product?.images.map((imageUrl) => imageUrl.split("/"));
    const publicIdWithFolder = urlParts.map(
      (urlPart) =>
        urlPart
          .slice(urlPart.indexOf("upload") + 2)
          .join("/")
          .split(".")[0]
    );

    const deletedImage = deleteImagesFromCloudinary(publicIdWithFolder);
    const deletedProduct = deleteProduct(id);
    const result = await Promise.all([deletedImage, deletedProduct]);
    if (result) {
      buildSuccessResponse(res, "", "Product Deleted.");
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
productRouter.patch(
  "/edit-product/:id",
  adminAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { existingImage, imagesToDeletefromCloud, ...rest } = req.body;

      // Deleting images from Cloudinary
      if (typeof imagesToDeletefromCloud === "object") {
        const urlParts = imagesToDeletefromCloud?.map((imageUrl) =>
          imageUrl.split("/")
        );
        const publicIdWithFolder = urlParts?.map(
          (urlPart) =>
            urlPart
              .slice(urlPart.indexOf("upload") + 2)
              .join("/")
              .split(".")[0]
        );
        await deleteImagesFromCloudinary(publicIdWithFolder);
      }
      if (typeof imagesToDeletefromCloud === "string") {
        const urlPart = imagesToDeletefromCloud.split("/");

        const publicIdWithFolder = urlPart
          .slice(urlPart.indexOf("upload") + 2)
          .join("/")
          .split(".")[0];

        await deleteImagesFromCloudinary(publicIdWithFolder);
      }

      let imagesForDb = [];
      if (req.files.length > 0 && !existingImage) {
        const uploadResults = await uploadImagesToCloudinary(req.files);
        imagesForDb = uploadResults.map((result) => result.secure_url);
      }
      if (req.files.length === 0 && existingImage) {
        imagesForDb = [...imagesForDb, ...existingImage];
      }
      if (req.files.length > 0 && existingImage) {
        const uploadResults = await uploadImagesToCloudinary(req.files);
        const uploadedImages = uploadResults.map((result) => result.secure_url);
        imagesForDb = [...uploadedImages, ...existingImage];
      }
      const editedProduct = await editProuct(id, rest, imagesForDb);

      if (editedProduct) {
        buildSuccessResponse(res, editedProduct, "Product Successfully edited");
      } else {
        buildErrorResponse(res, "Product update failed.");
      }
    } catch (error) {
      console.log(error);
      buildErrorResponse(
        res,
        "Sorry! Could not edit the product. Please try again."
      );
    }
  }
);
