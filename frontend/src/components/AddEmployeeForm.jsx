import React, { useState } from "react";
import axios from "axios";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!validateEmail(formData.email)) {
      setMessage({ type: "error", text: "Email invalide." });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage({
        type: "success",
        text: response.data.message || "Employé ajouté avec succès !",
      });

      setFormData({
        name: "",
        lastName: "",
        email: "",
        role: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Erreur lors de l'enregistrement.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl
                    shadow-lg border border-white border-4 shadow-blue-200
                    font-sans">
      <h2 className="text-center text-3xl font-extrabold text-blue-700 mb-8">
        Ajouter un Employé
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-blue-700">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-5 py-4 rounded-xl border-2 border-transparent
                       shadow-md placeholder-gray-400 focus:outline-none
                       focus:border-cyan-400 transition"
            placeholder="Entrez le nom"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-blue-700">Prénom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="px-5 py-4 rounded-xl border-2 border-transparent
                       shadow-md placeholder-gray-400 focus:outline-none
                       focus:border-cyan-400 transition"
            placeholder="Entrez le prénom"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-blue-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-5 py-4 rounded-xl border-2 border-transparent
                       shadow-md placeholder-gray-400 focus:outline-none
                       focus:border-cyan-400 transition"
            placeholder="Entrez l'email"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-blue-700">Rôle</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="px-5 py-4 rounded-xl border-2 border-transparent
                       shadow-md focus:outline-none focus:border-cyan-400 transition"
          >
            <option value="">Choisir un rôle</option>
            <option value="admin">Admin</option>
            <option value="employee">Employé</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600
                     text-white font-bold rounded-xl py-4 shadow-lg
                     hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Ajouter l'Employé"}
        </button>

        {message.text && (
          <p
            className={`text-center font-semibold ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddEmployeeForm;
