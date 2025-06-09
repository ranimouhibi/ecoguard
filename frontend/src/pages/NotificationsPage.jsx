import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Filtre date
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchNotifications = () => {
    setLoading(true);
    setError(null);

    const notifRef = ref(db, "notifications");

    const unsubscribe = onValue(
      notifRef,
      (snapshot) => {
        const notifs = [];
        snapshot.forEach((child) => {
          notifs.unshift({ id: child.key, ...child.val() });
        });
        setNotifications(notifs);
        setLoading(false);
        setCurrentPage(1);
      },
      (error) => {
        setError("Erreur lors du chargement des notifications.");
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchNotifications();
    return () => unsubscribe();
  }, []);

  // Fonction pour filtrer selon date
  const filterByDate = (notif) => {
    if (!notif.timestamp) return false;

    const notifDate = new Date(notif.timestamp);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && notifDate < start) return false;
    if (end) {
      // Ajout fin de journée à endDate pour inclure toute la journée sélectionnée
      const endDay = new Date(end);
      endDay.setHours(23, 59, 59, 999);
      if (notifDate > endDay) return false;
    }

    return true;
  };

  // Filtrer notifications
  const filteredNotifications = notifications.filter(filterByDate);

  // Pagination après filtrage
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  // Reset page si filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Toutes les notifications</h1>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          <label htmlFor="start-date" className="font-semibold text-gray-700">
            De :
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-1"
            max={endDate || undefined}
          />

          <label htmlFor="end-date" className="font-semibold text-gray-700">
            À :
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-1"
            min={startDate || undefined}
          />
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="text-blue-600 hover:underline ml-2"
            aria-label="Réinitialiser le filtre de date"
          >
            Réinitialiser
          </button>
        </div>

        <button
          onClick={() => fetchNotifications()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
          aria-label="Rafraîchir les notifications"
        >
          {loading ? "Chargement..." : "Rafraîchir"}
        </button>
      </div>

      {error && (
        <p className="mb-4 text-red-600 font-medium text-center" role="alert">
          {error}
        </p>
      )}

      {loading && !error ? (
        <p className="text-center text-gray-600">Chargement des notifications...</p>
      ) : filteredNotifications.length === 0 ? (
        <p className="text-center text-gray-600">Aucune notification pour cette période.</p>
      ) : (
        <>
          <ul className="max-h-[60vh] overflow-y-auto space-y-4 mb-4">
            {currentNotifications.map((notif) => (
              <li
                key={notif.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
                role="listitem"
              >
                <p className="text-gray-900 font-semibold">{notif.message}</p>
                {notif.timestamp && (
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(notif.timestamp).toLocaleString("fr-FR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
            >
              Précédent
            </button>

            <span className="text-gray-700">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
