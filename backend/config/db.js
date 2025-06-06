// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
console.error("❌ MONGO_URI manquant dans le fichier .env");
process.exit(1);
}

try {
await mongoose.connect(dbURI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
console.log("✅ Connecté à MongoDB :", dbURI);
} catch (error) {
console.error("❌ Erreur de connexion à MongoDB :", error.message);
process.exit(1);
}
};

module.exports = connectDB;