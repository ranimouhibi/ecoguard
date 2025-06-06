const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Modifier les informations du profil
exports.updateProfile = async (req, res) => {
const { name, lastName, email } = req.body;

try {
const user = await User.findById(req.params.id);
if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
user.name = name || user.name;
user.lastName = lastName || user.lastName;
user.email = email || user.email;

await user.save();
res.json({ message: "Profil mis à jour avec succès" });
} catch (err) {
console.error("Erreur updateProfile:", err.message);
res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
}
};

// ➤ Modifier le mot de passe
exports.changePassword = async (req, res) => {
const { currentPassword, newPassword } = req.body;

if (!currentPassword || !newPassword) {
return res.status(400).json({ message: "Ancien et nouveau mot de passe requis." });
}

try {
if (req.user.id !== req.params.id) {
return res.status(403).json({ message: "Accès interdit." });
}

const user = await User.findById(req.params.id);
if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

const isMatch = await bcrypt.compare(currentPassword, user.password);
if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

user.password = await bcrypt.hash(newPassword, 10);
await user.save();

res.json({ message: "Mot de passe modifié avec succès" });
} catch (err) {
console.error("Erreur changePassword:", err.message);
res.status(500).json({ message: "Erreur serveur lors du changement de mot de passe" });
}
};