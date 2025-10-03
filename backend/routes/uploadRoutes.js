import multer from "multer";
import path from "path";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", uploadSingleImage, async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No image file provided" });
  }

  try {
    // 1. Convert the file buffer to a base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // 2. Upload the data URI to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "mind-arc-project-uploads",
    });

    // 3. Send the secure URL back to the client/frontend
    res.status(200).send({
      message: "Image uploaded successfully",
      // This is the public, secure URL of the image hosted on Cloudinary
      image: result.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).send({ message: "Image upload failed. " + error.message });
  }
});

export default router;
