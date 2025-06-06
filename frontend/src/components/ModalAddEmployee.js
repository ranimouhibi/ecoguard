import React, { useState } from "react";
import axios from "axios";

const ModalAddEmployee = () => {
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({
name: "",
lastName: "",
email: "",
role: "",
});
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState({ type: "", text: "" });

const handleChange = (e) =>
setFormData({ ...formData, [e.target.name]: e.target.value });

const validateEmail = (email) =>
/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);

const handleSubmit = async (e) => {
e.preventDefault();
setMessage({ type: "", text: "" });

if (!validateEmail(formData.email)) {
  setMessage({ type: "error", text: "Email invalide." });
  return;
}

setLoading(true);

try {
  const res = await axios.post("http://localhost:5000/api/auth/register", formData);
  setMessage({ type: "success", text: res.data.message || "Employé ajouté avec succès !" });
  setFormData({ name: "", lastName: "", email: "", role: "" });
} catch (error) {
  setMessage({
    type: "error",
    text: error.response?.data?.error || "Erreur lors de l'enregistrement.",
  });
} finally {
  setLoading(false);
}
};

const handleClose = () => {
setShowModal(false);
setMessage({ type: "", text: "" });
};

return (
<div>
<button style={styles.openButton} onClick={() => setShowModal(true)}>
Ajouter un employé
</button>

  {showModal && (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Ajouter un Employé</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Prénom"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Choisir un rôle</option>
            <option value="admin">Admin</option>
            <option value="employee">Employé</option>
          </select>
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? "Enregistrement..." : "Ajouter"}
          </button>
          {message.text && (
            <p
              style={{
                ...styles.message,
                color: message.type === "error" ? "red" : "green",
              }}
            >
              {message.text}
            </p>
          )}
          <button type="button" onClick={handleClose} style={styles.cancelButton}>
            Fermer
          </button>
        </form>
      </div>
    </div>
  )}
</div>
);
};

const styles = {
openButton: {
padding: "10px 20px",
backgroundColor: "#007bff",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer",
},
overlay: {
position: "fixed",
top: 0, left: 0, right: 0, bottom: 0,
backgroundColor: "rgba(0,0,0,0.5)",
display: "flex",
justifyContent: "center",
alignItems: "center",
zIndex: 9999,
},
modal: {
backgroundColor: "#fff",
padding: "2rem",
borderRadius: "8px",
width: "90%",
maxWidth: "400px",
boxShadow: "0 0 10px rgba(0,0,0,0.25)",
},
form: {
display: "flex",
flexDirection: "column",
gap: "1rem",
},
input: {
padding: "0.5rem",
borderRadius: "5px",
border: "1px solid #ccc",
},
submitButton: {
backgroundColor: "#28a745",
color: "#fff",
padding: "10px",
borderRadius: "5px",
border: "none",
cursor: "pointer",
},
cancelButton: {
backgroundColor: "#dc3545",
color: "#fff",
padding: "10px",
borderRadius: "5px",
border: "none",
cursor: "pointer",
},
message: {
textAlign: "center",
fontWeight: "bold",
},
};

export default ModalAddEmployee;