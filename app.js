// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler } = require("./utils/errorHandler");
const authRoutes = require("./routes/authRoutes");
const clipRoutes = require("./routes/clipRoutes");
const connectDB = require("./config/db");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clips", clipRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to SavePoint API");
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`SavePoint server running on port ${PORT}`);
  });
});

module.exports = app;
