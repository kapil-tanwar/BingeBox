import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from "./config/envVar.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

// Trust Render/Proxy so secure cookies work behind TLS termination
app.set("trust proxy", 1);

const parseOrigins = () => {
  if (ENV_VARS.NODE_ENV === "production") {
    if (!ENV_VARS.FRONTEND_ORIGIN) return [];
    return ENV_VARS.FRONTEND_ORIGIN.split(",")
      .map((o) => o.trim().replace(/\/+$/, ""))
      .filter(Boolean);
  }
  return ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
};

const allowedOrigins = parseOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // If request has no Origin header (same-origin, Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, "");
    // If FRONTEND_ORIGIN is not set, or cleanOrigin matches whitelist, or cleanOrigin ends with onrender.com / vercel.app
    if (
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app") ||
      cleanOrigin.endsWith(".onrender.com")
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/tv", tvRoutes);
app.use("/api/search", searchRoutes);
 
const frontendDistPath = path.join(__dirname, "frontend", "dist");
const hasFrontendDist = fs.existsSync(frontendDistPath);

if (hasFrontendDist) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    // If request starts with /api, pass to 404 handler instead of index.html
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log('MONGO_URI:', ENV_VARS.MONGO_URI);
  connectDB();
});
