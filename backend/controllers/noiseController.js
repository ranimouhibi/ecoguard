// controllers/noiseController.js
const NoiseData = require("../models/NoiseModel");

exports.getAllNoiseData = async (req, res) => {
  try {
    const data = await NoiseData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};