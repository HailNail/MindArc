import dotenv from "dotenv";
dotenv.config();

export default {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  portEnv: process.env.PORT,
  jwt: process.env.JWT_SECRET,
  node: process.env.NODE_ENV,
  mongo: process.env.MONGO_URI,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    apiKey: process.env.CLOUDINARY_API_KEY,
  },
};
