import multer from "multer";
import cloudinary from "../../config/cloudinaryConfig.js";

// Configure multer to use memory storage
export const upload = multer({ storage: multer.memoryStorage() });

export const uploadImagesToCloudinary = (files) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "Product" }, (error, uploadedResult) => {
            if (error) {
              return reject("Cloudinary upload error:", error);
            }

            return resolve(uploadedResult);
          })
          .end(file.buffer);
      });
    })
  );
};

export const deleteImagesFromCloudinary = (publicIds) => {
  if (typeof publicIds === "string") {
    // console.log("String");
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicIds, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }
  return Promise.all(
    publicIds.map((publicId) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            return reject(error);
          }

          return resolve(result);
        });
      });
    })
  );
};
