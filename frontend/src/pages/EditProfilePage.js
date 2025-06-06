import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSuccessMessage("Profil mis à jour avec succès !");
        setErrorMessage("");
        setTimeout(() => {
          navigate(`/profile/${user._id}`);
        }, 1500);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      setErrorMessage("Erreur réseau.");
    }
  };

  const handleCancel = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <div className="flex justify-center p-6 bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg border border-white
                   border-4 shadow-blue-200 space-y-6"
      >
        <h2 className="text-center text-3xl font-extrabold text-blue-700">
          Modifier le profil
        </h2>

        <div>
          <label className="block font-semibold mb-2 text-blue-700">Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white rounded-xl px-5 py-4 shadow-md
                       border-2 border-transparent focus:border-cyan-400
                       placeholder-gray-400 focus:outline-none transition"
            placeholder="Entrez votre nom"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-blue-700">Prénom :</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-white rounded-xl px-5 py-4 shadow-md
                       border-2 border-transparent focus:border-cyan-400
                       placeholder-gray-400 focus:outline-none transition"
            placeholder="Entrez votre prénom"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-blue-700">Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white rounded-xl px-5 py-4 shadow-md
                       border-2 border-transparent focus:border-cyan-400
                       placeholder-gray-400 focus:outline-none transition"
            placeholder="Entrez votre email"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold
                       rounded-xl py-4 shadow-lg hover:scale-105 transition-transform"
          >
            Enregistrer les modifications
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-600 text-white font-bold rounded-xl py-4
                       hover:bg-gray-700 transition-colors"
          >
            Revenir au profil
          </button>
        </div>

        {successMessage && (
          <p className="text-green-600 text-center font-semibold">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center font-semibold">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default EditProfilePage;
