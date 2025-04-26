// models/Clip.js
const mongoose = require("mongoose");

const ClipSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"],
  },
  content: {
    type: String,
    required: [true, "Please add content"],
  },
  url: {
    type: String,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for better searching
ClipSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Clip", ClipSchema);
