import mongoose from "mongoose";

export const connectToMongoDb = () => {
  try {
    const connect = mongoose.connect(process.env.DB_CONNECT_URL);
    if (connect) {
      console.log(`Database connected: ${process.env.DB_CONNECT_URL}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
