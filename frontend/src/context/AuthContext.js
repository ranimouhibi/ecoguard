import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [user, setUser] = useState(null);

const extractUserId = (decodedToken) => {
return decodedToken._id || decodedToken.id || decodedToken.sub || null;
};

useEffect(() => {
const token = localStorage.getItem("authToken");
if (token) {
try {
const decoded = jwtDecode(token);
const userId = extractUserId(decoded);
setIsAuthenticated(true);
setUser({ ...decoded, _id: userId });
} catch (error) {
console.error("Token invalide :", error);
logout();
}
}
setIsLoading(false);
}, []);

const login = (token) => {
localStorage.setItem("authToken", token);
try {
const decoded = jwtDecode(token);
const userId = extractUserId(decoded);
setIsAuthenticated(true);
setUser({ ...decoded, _id: userId });
} catch (error) {
console.error("Erreur lors du décodage du token :", error);
logout();
}
};

const logout = () => {
localStorage.removeItem("authToken");
setIsAuthenticated(false);
setUser(null);
};

return (
<AuthContext.Provider
value={{ isAuthenticated, isLoading, user, login, logout }}
>
{children}
</AuthContext.Provider>
);
};