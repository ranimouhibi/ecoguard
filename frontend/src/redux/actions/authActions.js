import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Types d'actions
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const AUTH_ERROR = "AUTH_ERROR";

// Action : Connexion utilisateur
export const login = (token) => {
  return (dispatch) => {
    try {
      // Décodage du token JWT
      const decoded = jwtDecode(token);

      // Sauvegarde du token dans le localStorage
      localStorage.setItem("authToken", token);

      // Dispatch de la connexion réussie
      dispatch({
        type: LOGIN_SUCCESS,
        payload: decoded,
      });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error.message,
      });
    }
  };
};

// Action : Déconnexion utilisateur
export const logout = () => {
  return (dispatch) => {
    // Suppression du token du localStorage
    localStorage.removeItem("authToken");

    // Dispatch de la déconnexion
    dispatch({
      type: LOGOUT,
    });
  };
};

// Action : Enregistrement utilisateur
export const register = (userData) => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();

        // Dispatch après enregistrement réussi (facultatif)
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data.user,
        });

        return data;
      } else {
        throw new Error("Erreur lors de l'inscription");
      }
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error.message,
      });
      return { error: error.message };
    }
  };
};
