import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config(); // Or dotenv.config({ path: ".env.dev" }) if preferred, but .env is standard

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeRoutes from "./routes/likeRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import aiRoutes from "./routes/aiRoutes";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";

const app = express();

const intApp = () => {
  const promise = new Promise<Express>((resolve, reject) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(function (req, res, next) {
      const origin = req.headers.origin || "*";
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Allow-Credentials", "true");

      next();
    });

    app.use("/public", express.static("./public"));
    app.use("/uploads", express.static("./public/uploads")); // Added for this project
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/likes", likeRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/upload", uploadRoutes);

    // Serve static files from the React app (client/dist)
    // We use process.cwd() to ensure it works regardless of where the file is compiled
    const clientPath = path.join(process.cwd(), "..", "client", "dist");
    app.use(express.static(clientPath));

    // The catch-all handler: for any request that doesn't match one above, send back React's index.html file.
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientPath, "index.html"));
    });

    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      console.error("MONGODB_URI is not defined in the environment variables.");
      reject(new Error("MONGODB_URI is not defined"));
    } else {
      mongoose
        .connect(dbUri)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }

    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error("DB connection error:", error);
    });
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  });
  return promise;
};

export default intApp;
