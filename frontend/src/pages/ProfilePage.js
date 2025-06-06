import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ← à ajouter

const ProfilePage = () => {
const { user } = useContext(AuthContext);
const navigate = useNavigate(); // ← à ajouter

if (!user) {
return <p style={{ textAlign: "center", marginTop: "2rem" }}>Chargement...</p>;
}

return (
<div style={styles.container}>
<div style={styles.card}>
<h2 style={styles.title}>
  Profil de {user.name} {user.lastName}
</h2>
<p><strong>Nom :</strong> {user.name}</p>
<p><strong>Prénom :</strong> {user.lastName}</p>
<p><strong>Email :</strong> {user.email}</p>
<p><strong>Rôle :</strong> {user.role}</p>
<div style={styles.buttonContainer}>
<button style={styles.button} onClick={() => navigate("/profile/edit")}>
Modifier le profil
</button>
<button style={styles.buttonSecondary} onClick={() => navigate("/profile/change-password")}>
Changer le mot de passe
</button>
</div>
</div>
</div>
);
};

const styles = {
container: {
padding: "2rem",
display: "flex",
justifyContent: "center",
alignItems: "center",
minHeight: "80vh",
backgroundColor: "#f9f9f9",
},
card: {
padding: "2rem",
borderRadius: "10px",
backgroundColor: "#fff",
boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
width: "100%",
maxWidth: "500px",
},
title: {
marginBottom: "1rem",
color: "#333",
},
buttonContainer: {
marginTop: "2rem",
display: "flex",
gap: "1rem",
},
button: {
padding: "0.5rem 1rem",
backgroundColor: "#007bff",
color: "#fff",
border: "none",
borderRadius: "5px",
cursor: "pointer",
},
buttonSecondary: {
padding: "0.5rem 1rem",
backgroundColor: "#6c757d",
color: "#fff",
border: "none",
borderRadius: "5px",
cursor: "pointer",
},
};

export default ProfilePage;