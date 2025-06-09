const express = require("express");
const router = express.Router();

// Import des contrôleurs
const {
  login,
  register,
  requestResetPassword,
  resetPassword
} = require("../controllers/authController");

// Route pour se connecter
router.post("/login", login);

// Route pour s'inscrire
router.post("/register", register);



// Route pour réinitialiser le mot de passe (avec token)
router.post("/reset-password", resetPassword);

module.exports = router;
