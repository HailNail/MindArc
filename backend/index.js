// packages
import config from "./config/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

const port = config.portEnv || 5000;

connectDB();

const app = express();

const allowedOrigins = [
  "https://mind-arc-mu.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);

app.get("/api/config/stripe", (req, res) => {
  res.send({ publishableKey: config.stripe.publishableKey });
});

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log(
    "Production mode: Serving static files from",
    path.join(__dirname, "frontend", "dist")
  );
  // Serve static files from the frontend dist directory
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // Handle SPA routing - serve index.html for all unknown routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  // Simple check for local dev
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.listen(port, () => console.log(`Server running on port: ${port}`));
