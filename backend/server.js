// server.js
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const TemperatureData = require("./models/TemperatureModel");
const NoiseData = require("./models/NoiseModel");
const User = require("./models/User");

// MQTT
const { client, MQTT_TOPIC_TEMP, MQTT_TOPIC_NOISE } = require("./config/mqttConfig");

// RabbitMQ
const { connectRabbitMQ, publishToQueue } = require("./config/rabbitmqConfig");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const temperatureRoutes = require("./routes/TemperatureRoutes");
const noiseRoutes = require("./routes/noiseRoutes");

const app = express();
const server = http.createServer(app);

// WebSocket (socket.io)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

connectDB();
connectRabbitMQ();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", temperatureRoutes);
app.use("/api", noiseRoutes);

// Créer un admin par défaut
async function createDefaultAdmin() {
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      lastName: "Principal",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });
    console.log("✅ Compte Admin créé : admin@example.com / admin123");
  } else {
    console.log("✅ Compte Admin déjà existant.");
  }
}

// MQTT → DB + WebSocket + RabbitMQ
client.on("message", async (topic, message) => {
  const value = parseFloat(message.toString());
  console.log(`📬 MQTT reçu sur ${topic}: ${value}`);

  try {
    if (topic === MQTT_TOPIC_TEMP) {
      const newData = new TemperatureData({ temperature: value });
      await newData.save();
      publishToQueue("temperature_data", newData);
      io.emit("temperature", { temperature: value, time: new Date().toLocaleTimeString() });
    } else if (topic === MQTT_TOPIC_NOISE) {
      const newData = new NoiseData({ noiseLevel: value });
      await newData.save();
      publishToQueue("noise_data", newData);
      io.emit("noise", { noise: value, time: new Date().toLocaleTimeString() });
    }
  } catch (err) {
    console.error("❌ Erreur MQTT -> DB/WebSocket:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  await createDefaultAdmin();
});