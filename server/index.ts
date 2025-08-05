import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDatabase from "./config/database";
import { signup, login, getProfile } from "./routes/auth";
import { createOrder } from "./routes/payments";
import { getAllProperties, getPropertyById, getSellerProperties, createProperty, updateProperty, deleteProperty,addPropertyImages } from "./routes/properties";
import { authenticateToken, requireRole } from "./middleware/auth";

// Connect to MongoDB
connectDatabase();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Authentication routes
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.get("/api/auth/profile", getProfile);

  // Property routes
  app.get("/api/properties", authenticateToken, getAllProperties);
  app.get("/api/properties/:id", authenticateToken, getPropertyById);
  app.get("/api/seller/properties", authenticateToken, requireRole('seller'), getSellerProperties);
  app.post("/api/seller/properties", authenticateToken, requireRole('seller'), createProperty);
  app.put("/api/seller/properties/:id", authenticateToken, requireRole('seller'), updateProperty);
  app.delete("/api/seller/properties/:id", authenticateToken, requireRole('seller'), deleteProperty);
  app.post("/api/seller/properties/:id/images", authenticateToken, requireRole('seller'), addPropertyImages);

  app.post('/api/create-order', createOrder);

  return app;
}
