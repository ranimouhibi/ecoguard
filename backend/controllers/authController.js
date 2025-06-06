const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");
const crypto = require("crypto");

// Stock temporaire pour les OTP
const otpStore = new Map();

// ➔ Enregistrement d’un nouvel employé
exports.register = async (req, res) => {
  const { name, lastName, email, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé." });
    }

    // Générer un mot de passe aléatoire
    const randomPassword = Math.random().toString(36).slice(-8);
    //console.log("Mot de passe généré :", randomPassword); // ➔ pour vérification

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Créer l'utilisateur
    const user = await User.create({
      name,
      lastName,
      email,
      role,
      password: hashedPassword,
    });

    // Envoyer l'email avec le mot de passe
    try {
      await transporter.sendMail({
        from: `"Gestion RH" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Création de votre compte - Accès à la plateforme",
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px;">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Votre compte a été créé avec succès sur la plateforme RH.</p>
            <p><strong>Mot de passe temporaire :</strong> ${randomPassword}</p>
            <p>Veuillez vous connecter et changer votre mot de passe dès que possible.</p>
            <p>Merci,</p>
            <p style="color: #F7941D;">Admin</p>
          </div>
        `,
      });
      
    } catch (emailError) {
      console.error("Erreur d'envoi de l'email :", emailError);
      return res.status(500).json({ error: "Utilisateur créé, mais l'email n'a pas pu être envoyé." });
    }

    res.status(201).json({ message: "Employé ajouté et email envoyé." });
  } catch (error) {
    console.error("Erreur lors de la création de l'employé :", error);
    res.status(500).json({ error: "Erreur lors de la création de l'employé." });
  }
};

// ➔ Connexion utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  
    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
};

// ➔ Demander un code pour réinitialiser le mot de passe
exports.requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email introuvable." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Code de Réinitialisation",
      text: `Votre code de réinitialisation est : ${otp}`,
    });

    res.json({ message: "Code envoyé par email." });
  } catch (error) {
    console.error("Erreur lors de l'envoi du code :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du code." });
  }
};

// ➔ Réinitialiser le mot de passe avec le code OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const storedOtp = otpStore.get(email);
    if (storedOtp !== otp) {
      return res.status(400).json({ error: "Code OTP incorrect." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    otpStore.delete(email); // Nettoyer l'OTP après usage

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation :", error);
    res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe." });
  }
};
