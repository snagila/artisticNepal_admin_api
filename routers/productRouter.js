import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  upload,
  uploadImagesToCloudinary,
} from "../middlewares/imageUploader/cloudinaryImageUploader.js";

export const productRouter = express.Router();

productRouter.post(
  "/productImages",
  adminAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (req.files?.length > 0) {
        const uploadResults = await uploadImagesToCloudinary(req.files);

        const uplaodedImages = uploadResults.map((result) => result.secure_url);

        console.log("uplaodedImages", updatedImages);

        const product = await updateproduct({ _id, images: updatedImages });

        product?._id
          ? buildSuccessResponse(
              res,
              product,
              "Product Image added Successfully."
            )
          : buildErrorResponse(res, "Could not add the images!");

        return;
      }
    } catch (error) {
      buildErrorResponse(res, "Could not add the images!");
    }
  }
);
