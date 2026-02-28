const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { ensureModel } = require("./config/modelLoader");

dotenv.config();

const app = express();

// CORS — open for hackathon demo
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads/ directory");
}

// Serve uploads statically (for previewing images if needed)
app.use("/uploads", express.static(uploadsDir));

// Check AI model on startup
ensureModel();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/predict", require("./routes/predictionRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "OsteoAI Backend is running 🦴",
    timestamp: new Date().toISOString(),
    model: process.env.MODEL_PATH || "./ai-model/osteoporosis_cnn_model.h5"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 OsteoAI Backend running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Auth API:     http://localhost:${PORT}/api/auth`);
  console.log(`   Predict API:  http://localhost:${PORT}/api/predict\n`);
});