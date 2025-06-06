import { useEffect, useState } from "react";
import { ref, query, limitToLast, onValue } from "firebase/database";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";

export default function NotificationListener() {
  const [lastNotifId, setLastNotifId] = useState(null); // Pour éviter les doublons

  useEffect(() => {
    const notifRef = ref(db, "notifications");
    // Limiter à la dernière notification
    const lastNotifQuery = query(notifRef, limitToLast(1));

    const unsubscribe = onValue(lastNotifQuery, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const data = childSnapshot.val();
        if (data?.message && key !== lastNotifId) {
          toast.info(data.message, {
            position: "top-right",
            autoClose: 6000,
            theme: "colored",
          });
          setLastNotifId(key);
        }
      });
    });

    return () => unsubscribe();
  }, [lastNotifId]);

  return <ToastContainer />;
}
