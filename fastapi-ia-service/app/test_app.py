import unittest
from app.notifier import send_notification_to_firebase, build_alert_message
from app.model import AnomalyDetector
from datetime import datetime, timezone

class TestNotifier(unittest.TestCase):
    def test_send_notification_to_firebase_real(self):
        """
        Test envoi réel à Firebase avec un vrai message construit à partir d'une anomalie détectée.
        ATTENTION : ce test envoie une vraie alerte dans ta base Firebase.
        """
        detector = AnomalyDetector(temp_bounds=(15, 80), noise_bounds=(30, 100))
        detector.fit([20, 25, 30, 35, 40], [30, 40, 50, 45, 35])

        temperature = 85  # Anomalie
        noise = 110       # Anomalie

        detection_result = detector.detect(temperature, noise)

        # On récupère uniquement la liste des anomalies
        anomalies = detection_result.get("anomalies", [])

        # Construire le message
        message = build_alert_message(anomalies)

        # Ajouter un timestamp
        alert = {
            "status": "alert",
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        # Envoyer à Firebase
        result = send_notification_to_firebase(alert)
        self.assertTrue(result)

if __name__ == "__main__":
    unittest.main()

    