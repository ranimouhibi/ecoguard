// controllers/temperatureController.js
const TemperatureData = require("../models/TemperatureModel");

exports.getAllTemperatureData = async (req, res) => {
  try {
    const data = await TemperatureData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};