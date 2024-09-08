import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
    },
    categoryThumbnail: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("categories", categorySchema);
