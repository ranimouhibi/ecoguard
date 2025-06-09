import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // <-- import useNavigate

const ResetPasswordPage = () => {
  const navigate = useNavigate();  // <-- initialiser useNavigate
  const [step, setStep] = useState(1); // 1 = demande code, 2 = reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Demander le code OTP
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.post("http://localhost:5000/api/auth/request-reset-password", { email });
      setSuccessMsg("Code de réinitialisation envoyé par email.");
      setStep(2);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Erreur lors de la demande de code.");
    }
  };

  // Réinitialiser le mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setSuccessMsg("Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-300">
        {step === 1 && (
          <>
            <h2 className="text-center text-2xl font-bold mb-6">Mot de passe oublié</h2>
            {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

            <form onSubmit={handleRequestCode}>
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
              >
                Demander un code de réinitialisation
              </button>
            </form>

            {/* Bouton retour vers login */}
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full text-center text-blue-600 underline"
            >
              Retour à la page de connexion
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-center text-2xl font-bold mb-6">Réinitialiser le mot de passe</h2>
            {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                disabled
                className="w-full p-3 mb-4 border rounded bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="Code reçu par email"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mb-4 border rounded"
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 mb-4 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
              >
                Réinitialiser le mot de passe
              </button>
            </form>

            <button
              onClick={() => {
                setStep(1);
                setOtp("");
                setNewPassword("");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="mt-4 text-blue-600 underline"
            >
              Retour à la demande de code
            </button>

            {/* Bouton retour vers login */}
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full text-center text-blue-600 underline"
            >
              Retour à la page de connexion
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
