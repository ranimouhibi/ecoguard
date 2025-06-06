import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ChangePasswordPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!user || !user._id) {
      setError("Utilisateur non identifié. Veuillez vous reconnecter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/api/users/${user._id}/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Mot de passe changé avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Une erreur est survenue.";
      setError(errorMessage);
    }
  };

  const handleBackToProfile = () => {
    navigate(`/profile/${user?._id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          🔒 Changer le mot de passe
        </h2>

        {message && (
          <p className="text-green-600 text-sm font-medium mb-2">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm font-medium mb-2">{error}</p>
        )}

        <label className="text-gray-700 font-medium mt-2">Mot de passe actuel</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md mt-1 focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label className="text-gray-700 font-medium mt-3">Nouveau mot de passe</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md mt-1 focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label className="text-gray-700 font-medium mt-3">Confirmer le nouveau mot de passe</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md mt-1 focus:outline-none focus:ring focus:ring-blue-300"
        />

        <button
          type="submit"
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Changer
        </button>

        <button
          type="button"
          onClick={handleBackToProfile}
          className="mt-3 w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition duration-200"
        >
          Revenir au profil
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
