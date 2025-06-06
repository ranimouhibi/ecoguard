// models/NoiseModel.js
const mongoose = require("mongoose");  // Add this line to import mongoose

const NoiseSchema = new mongoose.Schema({
  noiseLevel: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NoiseData", NoiseSchema);