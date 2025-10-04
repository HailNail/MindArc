import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      config.node === "production"
        ? config.mongo
        : config.mongoLocal || "mongodb://127.0.0.1:27017/mindArc"
    );
    console.log(`Successfully connected to mongoDB`);
    console.log(
      `Connected to database: ${
        config.node === "production" ? config.mongo : config.mongoLocal
      }`
    );
    console.log(`Running in ${process.env.NODE_ENV} mode`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
