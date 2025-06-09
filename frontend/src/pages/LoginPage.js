import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-sm w-full bg-gradient-to-b from-white to-gray-100 p-8 rounded-3xl shadow-xl border-4 border-white">
        <h2 className="text-center text-3xl font-bold text-blue-500">Connexion</h2>

        {errorMsg && (
          <div className="mt-4 text-center text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@domaine.com"
              required
              className="w-full p-4 mt-1 rounded-xl shadow-md border-2 border-transparent focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="relative mt-4">
            <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-4 mt-1 pr-10 rounded-xl shadow-md border-2 border-transparent focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-800 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

         <button onClick={
          () => navigate("/reset-password")} className="text-blue-500 underline">
           Mot de passe oublié ?
         </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Connexion..." : "Connexion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
