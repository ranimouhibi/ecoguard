// routes/noiseRoutes.js
const express = require("express");  // Add this line to import express
const { getAllNoiseData } = require("../controllers/noiseController");

const noiseRouter = express.Router();
noiseRouter.get("/noise", getAllNoiseData);

module.exports = noiseRouter;