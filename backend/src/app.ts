import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import healthRouter from "./routes/health.routes";

dotenv.config();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());

app.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "PulseOps API is running",
    version: "0.1.0",
  });
});

app.use("/api/health", healthRouter);

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
