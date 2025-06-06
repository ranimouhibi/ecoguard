// components/EditEmployerModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditEmployerModal = ({ id, onClose, onSuccess }) => {
  const [employer, setEmployer] = useState({
    name: "",
    lastName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployer(response.data);
      } catch (err) {
        toast.error("Erreur lors du chargement.");
      }
    };
    fetchEmployer();
  }, [id]);

  const handleChange = (e) => {
    setEmployer({ ...employer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:5000/api/users/${id}`, employer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employé mis à jour !");
      onSuccess(); // recharge la liste
      onClose(); // ferme la popup
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-red-500">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Modifier l'Employé</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={employer.name} onChange={handleChange} placeholder="Prénom" className="w-full p-2 border rounded" required />
          <input type="text" name="lastName" value={employer.lastName} onChange={handleChange} placeholder="Nom" className="w-full p-2 border rounded" required />
          <input type="email" name="email" value={employer.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
          <select name="role" value={employer.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Sélectionner un rôle</option>
            <option value="admin">Admin</option>
            <option value="employee">Employé</option>
          </select>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployerModal;
