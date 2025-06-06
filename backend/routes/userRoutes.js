const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const { updateProfile, changePassword } = require("../controllers/userController");

// ➤ Récupérer les infos du profil
router.get("/users/:id", verifyToken, async (req, res) => {
try {
const user = await User.findById(req.params.id).select("-password");
if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
res.json(user);
} catch (err) {
res.status(500).json({ message: "Erreur serveur" });
}
});

// ➤ Récupérer tous les employés (non-admins)
router.get("/employers", verifyToken, async (req, res) => {
try {
const employers = await User.find({ role: { $ne: "admin" } }).select("-password");
res.json(employers);
} catch (err) {
res.status(500).json({ message: "Erreur lors de la récupération des employés" });
}
});

// ➤ Mettre à jour le profil
router.put("/users/:id", verifyToken, updateProfile);

// ➤ Changer le mot de passe
router.put("/users/:id/password", verifyToken, changePassword);

// ➤ Mettre à jour un employé (admin peut modifier un employé)
router.put("/employers/:id", verifyToken, async (req, res) => {
try {
const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!updated) return res.status(404).json({ message: "Employé non trouvé" });
res.json(updated);
} catch (err) {
res.status(500).json({ message: "Erreur lors de la mise à jour de l'employé" });
}
});

// ➤ Supprimer un employé (non-admin)
router.delete("/employers/:id", verifyToken, async (req, res) => {
try {
const user = await User.findById(req.params.id);
if (!user || user.role === "admin") {
return res.status(404).json({ message: "Employé non trouvé ou invalide" });
}
await User.findByIdAndDelete(req.params.id);
res.status(200).json({ message: "Employé supprimé avec succès" });
} catch (err) {
res.status(500).json({ message: "Erreur lors de la suppression de l'employé" });
}
});

module.exports = router;