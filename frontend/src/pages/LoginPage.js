import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      login(token);

      const user = jwtDecode(token);
      const role = user.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "employee") {
        navigate("/employee");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setErrorMsg("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-sm w-full bg-gradient-to-b from-white to-gray-100 p-8 rounded-3xl shadow-xl border-4 border-white">
        <h2 className="text-center text-3xl font-bold text-blue-500">Connexion</h2>
        {errorMsg && <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-4 mt-4 rounded-xl shadow-md border-2 border-transparent focus:outline-none focus:border-cyan-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full p-4 mt-4 rounded-xl shadow-md border-2 border-transparent focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
