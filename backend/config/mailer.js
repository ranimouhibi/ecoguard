const nodemailer = require("nodemailer");

// Vérifie que les variables d'environnement sont bien définies
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER ou EMAIL_PASS manquants dans .env");
  process.exit(1);
}

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Vérification de la connexion SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Erreur de configuration du mailer :", error);
  } else {
    console.log("✅ Mailer prêt à envoyer les emails !");
  }
});

module.exports = transporter;