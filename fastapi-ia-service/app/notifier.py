import requests
import os
from datetime import datetime

# URL par défaut si la variable d'environnement n'est pas définie
FIREBASE_URL = os.getenv("FIREBASE_URL", "https://pfe-anomaly-e43fb-default-rtdb.firebaseio.com/notifications.json")

def send_notification_to_firebase(alert):
    """
    Envoie une alerte JSON vers Firebase Realtime Database.
    Ajoute un champ timestamp ISO 8601.
    """
    alert['timestamp'] = datetime.utcnow().isoformat() + "Z"  # UTC ISO format

    try:
        response = requests.post(FIREBASE_URL, json=alert)
        if response.status_code == 200:
            print("✅ Alerte envoyée avec succès à Firebase.")
            print("🆔 ID généré :", response.json().get("name"))
            return True
        else:
            print(f"❌ Erreur d'envoi à Firebase : {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print("❌ Exception réseau lors de l'envoi à Firebase :", e)
        return False
    except Exception as e:
        print("❌ Exception générale :", e)
        return False

def build_alert_message(anomalies):
    if not anomalies:
        return "✅ Tout est normal, aucune anomalie détectée."

    messages = []
    for anomaly in anomalies:
        t = anomaly.get("type", "inconnu")
        v = anomaly.get("value", "?")
        diff = anomaly.get("difference")

        if t == "temp_low":
            messages.append(f"🌡️ Température trop basse : {v}°C (↘ {diff}°C sous le seuil)")
        elif t == "temp_high":
            messages.append(f"🌡️ Température trop élevée : {v}°C (↗ {diff}°C au-dessus du seuil)")
        elif t == "temp_anomaly":
            messages.append(f"⚠️ Anomalie (Isolation Forest) détectée sur la température : {v}°C")
        elif t == "noise_low":
            messages.append(f"🔇 Bruit trop faible : {v} dB (↘ {diff} dB sous le seuil)")
        elif t == "noise_high":
            messages.append(f"🔊 Bruit trop élevé : {v} dB (↗ {diff} dB au-dessus du seuil)")
        elif t == "noise_anomaly":
            messages.append(f"⚠️ Anomalie (Isolation Forest) détectée sur le bruit : {v} dB")
        else:
            messages.append(f"❓ Anomalie inconnue : {t} = {v}")

    return "🚨 Alertes détectées :\n" + "\n".join(messages)
