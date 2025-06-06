import React, { useEffect, useState } from "react";
import axios from "axios";
import EditEmployerModal from "../components/EditEmployerModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployersList = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/api/employers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployers(response.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer la liste des employés.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet employé ?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/api/employers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployers(employers.filter((e) => e._id !== id));
      toast.success("Employé supprimé.");
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleEdit = (id) => {
    setSelectedEmployerId(id);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const filteredEmployers = employers.filter(
    (employer) =>
      employer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 font-sans">
      <h2 className="text-2xl mb-4">👨‍💼 Liste des Employés</h2>

      {/* Barre de recherche */}
      <div className="group relative max-w-xs mb-4">
        <svg
          className="icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input w-full h-10 pl-10 pr-4 rounded-lg border-2 border-transparent bg-gray-100 text-gray-900 placeholder-gray-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:shadow-md transition"
        />
      </div>

      {loading && <p>Chargement des données...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && filteredEmployers.length === 0 && <p>Aucun employé trouvé.</p>}

      {!loading && filteredEmployers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Prénom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Rôle</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployers.map((employer) => (
                <tr key={employer._id} style={trStyle}>
                  <td style={tdStyle}>{employer.lastName}</td>
                  <td style={tdStyle}>{employer.name}</td>
                  <td style={tdStyle}>{employer.email}</td>
                  <td style={tdStyle}>
                    <span style={getRoleStyle(employer.role)}>{employer.role}</span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={btnEdit}
                      onClick={() => handleEdit(employer._id)}
                    >
                      Modifier
                    </button>{" "}
                    <button
                      style={btnDelete}
                      onClick={() => handleDelete(employer._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditModal && selectedEmployerId && (
        <EditEmployerModal
          id={selectedEmployerId}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchEmployers}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

// Styles inline restants (tu peux aussi migrer vers Tailwind si tu veux)
const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const trStyle = {
  transition: "background-color 0.2s",
};

const btnEdit = {
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "8px",
};

const btnDelete = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const getRoleStyle = (role) => ({
  backgroundColor: role === "admin" ? "#facc15" : "#c7d2fe",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "0.9rem",
  fontWeight: "500",
});

export default EmployersList;
