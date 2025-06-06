// src/components/Header.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-100 shadow-md px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <nav>
          <ul className="flex flex-wrap gap-4 text-sm font-medium text-gray-700">
            {(user?.role === "admin" || user?.role === "manager") && (
              <>
                <li>
                  <Link
                    to="/admin"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Dashboard Admin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/gestion-employes"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Ajouter un Employé
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/employers"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Employés
                  </Link>
                </li>
              </>
            )}

            {user?.role === "employee" && (
              <li>
                <Link
                  to="/employee"
                  className="hover:text-blue-600 transition-colors"
                >
                  Dashboard Employé
                </Link>
              </li>
            )}

            {user?._id && (
              <li>
                <Link
                  to={`/profile/${user._id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  Profil
                </Link>
              </li>
            )}

            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:underline"
                >
                  Se Déconnecter
                </button>
              </li>
            )}
          </ul>
        </nav>

        {user?.name && (
          <p className="text-sm text-gray-600 mt-2 md:mt-0">
            Bienvenue, <span className="font-semibold">{user.name}</span>!
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
