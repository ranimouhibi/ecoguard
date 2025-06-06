// models/TemperatureModel.js
const mongoose = require("mongoose");

const TemperatureSchema = new mongoose.Schema({
  temperature: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TemperatureData", TemperatureSchema);