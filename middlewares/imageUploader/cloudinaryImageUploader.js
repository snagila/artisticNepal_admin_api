import multer from "multer";

// Configure multer to use memory storage
export const upload = multer({ storage: multer.memoryStorage() });

export const uploadImagesToCloudinary = (files) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "Product" }, (error, uploadedResult) => {
            if (error) {
              return reject(error);
            }

            return resolve(uploadedResult);
          })
          .end(file.buffer);
      });
    })
  );
};
