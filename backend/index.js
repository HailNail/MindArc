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
  "https://mind-8rtfvj6v6-hailnails-projects.vercel.app",

  "http://localhost:3000",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or postman)
    if (!origin) return callback(null, true);

    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Cookie",
  ],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log("Cookies received:", req.cookies);
  console.log("Origin:", req.headers.origin);
  next();
});

app.get("/api/debug-cookie", (req, res) => {
  res.cookie("debug_cookie", "test_value", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({
    message: "Debug cookie set",
    cookiesReceived: req.cookies,
  });
});

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
