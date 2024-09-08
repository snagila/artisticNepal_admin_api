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
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const [uploadImage, uploadThumbnail] = await Promise.all([
        uploadImagesToCloudinary(req.files["images"]),
        uploadImagesToCloudinary(req.files["thumbnail"]),
      ]);

      const imagesForDb = uploadImage.map((result) => result.secure_url);
      const thumbnailForDb = uploadThumbnail.map((result) => result.secure_url);

      if (imagesForDb && thumbnailForDb) {
        req.body.images = imagesForDb;
        req.body.thumbnail = thumbnailForDb;
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
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "newThumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        existingImages,
        imagesToDeletefromCloud,
        existingThumbnail,
        thumbnailToDeleteFromCloud,
        ...rest
      } = req.body;

      let thumbnailForDb;
      if (!req.files["newThumbnail"] && existingThumbnail) {
        thumbnailForDb = [existingThumbnail];
      }
      if (req.files["newThumbnail"] && thumbnailToDeleteFromCloud) {
        const urlPart = thumbnailToDeleteFromCloud.split("/");

        const publicIdWithFolder = urlPart
          .slice(urlPart.indexOf("upload") + 2)
          .join("/")
          .split(".")[0];

        const [deleteThumbnail, updatethumbnail] = await Promise.all([
          deleteImagesFromCloudinary(publicIdWithFolder),
          uploadImagesToCloudinary(req.files["newThumbnail"]),
        ]);
        const uploaded = updatethumbnail.map((result) => result.secure_url);
        thumbnailForDb = uploaded;
      }

      // THIS IS IMAGES EDITING PART ============================
      if (!imagesToDeletefromCloud?.length > 0) {
      } else {
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
      }

      let imagesForDb;

      if (req.files["images"]?.length > 0 && !existingImages) {
        const uploadResults = await uploadImagesToCloudinary(
          req.files["images"]
        );
        const uploaded = uploadResults.map((result) => result.secure_url);
        imagesForDb = [...uploaded];
      }

      if (!req.files["images"] && existingImages) {
        if (typeof existingImages === "string") {
          imagesForDb = [existingImages];
        } else {
          imagesForDb = [...existingImages];
        }
      }

      if (req.files["images"]?.length > 0 && existingImages) {
        const uploadResults = await uploadImagesToCloudinary(
          req.files["images"]
        );
        const uploaded = uploadResults.map((result) => result.secure_url);
        if (typeof existingImages === "string") {
          imagesForDb = [...uploaded, existingImages];
        } else {
          imagesForDb = [...uploaded, ...existingImages];
        }
      }

      const editedProduct = await editProuct(
        id,
        rest,
        thumbnailForDb,
        imagesForDb
      );
      // console.log(editedProduct);
      if (editedProduct) {
        buildSuccessResponse(res, editedProduct, "Product Successfully edited");
      } else {
        buildErrorResponse(res, "Product update failed.");
      }
    } catch (error) {
      console.log(error.message);
      buildErrorResponse(
        res,
        "Sorry! Could not edit the product. Please try again."
      );
    }
  }
);
