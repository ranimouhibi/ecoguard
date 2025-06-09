import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MdNotifications } from "react-icons/md";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "../firebase";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef();

  const isDashboard =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/employee");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Charger les notifications depuis Firebase
  useEffect(() => {
    const notifRef = ref(db, "notifications");
    const notifQuery = query(notifRef, limitToLast(10)); // Dernières 10

    const unsubscribe = onValue(notifQuery, (snapshot) => {
      const notifs = [];
      snapshot.forEach((child) => {
        notifs.unshift({ id: child.key, ...child.val() }); // plus récent en haut
      });
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, []);

  // Affichage du toast uniquement pour les nouvelles notifications dans le dashboard
  useEffect(() => {
    if (!isDashboard || notifications.length === 0) return;

    const lastSeenId = localStorage.getItem("lastSeenNotificationId");
    const latestNotif = notifications[0]; // La plus récente

    if (latestNotif.id !== lastSeenId) {
      if (latestNotif.message) {
        const toastElement = document.createElement("div");
        toastElement.innerText = latestNotif.message;
        toastElement.style = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #2b6cb0;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          z-index: 9999;
          font-size: 14px;
        `;
        document.body.appendChild(toastElement);

        setTimeout(() => {
          document.body.removeChild(toastElement);
        }, 5000);

        localStorage.setItem("lastSeenNotificationId", latestNotif.id);
      }
    }
  }, [notifications, isDashboard]);

  return (
    <header className="bg-gray-100 shadow-md px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <nav>
          <ul className="flex flex-wrap gap-4 text-sm font-medium text-gray-700">
            {(user?.role === "admin" || user?.role === "manager") && (
              <>
                <li>
                  <Link to="/admin" className="hover:text-blue-600 transition-colors">
                    Dashboard Admin
                  </Link>
                </li>
                <li>
                  <Link to="/admin/gestion-employes" className="hover:text-blue-600 transition-colors">
                    Ajouter un Employé
                  </Link>
                </li>
                <li>
                  <Link to="/admin/employers" className="hover:text-blue-600 transition-colors">
                    Employés
                  </Link>
                </li>
              </>
            )}

            {user?.role === "employee" && (
              <li>
                <Link to="/employee" className="hover:text-blue-600 transition-colors">
                  Dashboard Employé
                </Link>
              </li>
            )}

            {user?._id && (
              <li>
                <Link to={`/profile/${user._id}`} className="hover:text-blue-600 transition-colors">
                  Profil
                </Link>
              </li>
            )}

            {user && (
              <li>
                <button onClick={handleLogout} className="text-red-600 hover:underline">
                  Se Déconnecter
                </button>
              </li>
            )}
          </ul>
        </nav>

        {user && isDashboard && (
          <div className="relative flex items-center gap-4 mt-2 md:mt-0" ref={notificationRef}>
            <button
              className="relative text-gray-600 hover:text-blue-600 transition-colors text-xl"
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <MdNotifications />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <div className="p-4 border-b font-semibold text-gray-700">
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto text-sm">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-2 text-gray-500">Aucune notification</li>
                  ) : (
                    notifications.map((notif) => (
                      <li key={notif.id} className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100">
                        <p className="text-gray-800">{notif.message}</p>
                        {notif.timestamp && (
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(notif.timestamp).toLocaleString("fr-FR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </p>
                        )}
                      </li>
                    ))
                  )}
                  <li
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/notifications");
                    }}
                    className="px-4 py-2 text-center text-blue-500 hover:bg-gray-50 cursor-pointer"
                  >
                    Voir toutes les notifications
                  </li>
                </ul>
              </div>
            )}

            <p className="text-sm text-gray-600">
              Bienvenue, <span className="font-semibold">{user.name}</span>!
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
