// routes/temperatureRoutes.js
const express = require("express");
const { getAllTemperatureData } = require("../controllers/temperatureController");

const router = express.Router();
router.get("/temperature", getAllTemperatureData);

module.exports = router;