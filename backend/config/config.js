import dotenv from "dotenv";
dotenv.config();

const isDev = process.env.NODE_ENV === "development";

export default {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  portEnv: process.env.PORT,
  jwt: process.env.JWT_SECRET,
  node: process.env.NODE_ENV,
  nodeLocal: process.env.NODE_ENV_LOCAL,
  mongo: process.env.MONGO_URI,
  mongoLocal: process.env.MONGO_LOCAL,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    apiKey: process.env.CLOUDINARY_API_KEY,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: isDev
      ? "http://localhost:5000/api/users/google/callback"
      : "https://mind-arc-api.onrender.com/api/users/google/callback",
  },
};
