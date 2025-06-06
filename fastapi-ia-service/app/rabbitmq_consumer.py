import pika
import json
import os
from dotenv import load_dotenv
from model import AnomalyDetector
from notifier import send_notification_to_firebase
from utils import add_data

load_dotenv()

detector = AnomalyDetector()

# Pour garder historique local des alertes dans un fichier JSON
import threading
import datetime

ALERTS_LOG_FILE = "anomalies_log.json"
alerts_log_lock = threading.Lock()

def log_alert_locally(alert):
    try:
        alerts_log_lock.acquire()
        try:
            # Lire l'ancien contenu
            try:
                with open(ALERTS_LOG_FILE, "r", encoding="utf-8") as f:
                    logs = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                logs = []

            # Ajouter la nouvelle alerte avec timestamp
            alert["timestamp"] = datetime.datetime.utcnow().isoformat() + "Z"
            logs.append(alert)

            # Écrire à nouveau
            with open(ALERTS_LOG_FILE, "w", encoding="utf-8") as f:
                json.dump(logs, f, indent=2)
        finally:
            alerts_log_lock.release()
    except Exception as e:
        print(f"❌ Erreur lors de la sauvegarde locale de l'alerte: {e}")

def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        temp = data.get("temperature")
        noise = data.get("noiseLevel")

        if temp is None or noise is None:
            print({"status": "warning", "message": "❗ Données incomplètes.", "data": data})
            return

        print(f"📥 Reçu: Température = {temp}, Bruit = {noise}")

        temp_hist, noise_hist = add_data(temp, noise)

        if len(temp_hist) >= 10:
            detector.fit(temp_hist, noise_hist)
            anomalies = detector.detect(temp, noise)

            if anomalies:
                alert = {
                    "status": "alert",
                    "message": "🚨 Anomalies détectées.",
                    "anomalies": anomalies,
                    "data": {"temperature": temp, "noiseLevel": noise}
                }
                print(json.dumps(alert, indent=2))

                # Enregistrer localement
                log_alert_locally(alert)

                # Envoyer vers Firebase
                send_notification_to_firebase(alert)

    except Exception as e:
        print(json.dumps({"status": "error", "message": f"❌ Erreur lors du traitement: {str(e)}"}))

def start_consumer():
    try:
        url = os.getenv("RABBITMQ_URI", "amqp://localhost")
        queue_temp = os.getenv("QUEUE_NAME_TEMP", "temperature_data")
        queue_noise = os.getenv("QUEUE_NAME_NOISE", "noise_data")

        connection = pika.BlockingConnection(pika.URLParameters(url))
        channel = connection.channel()
        channel.queue_declare(queue=queue_temp, durable=True)
        channel.queue_declare(queue=queue_noise, durable=True)

        channel.basic_consume(queue=queue_temp, on_message_callback=callback, auto_ack=True)
        channel.basic_consume(queue=queue_noise, on_message_callback=callback, auto_ack=True)

        print("📡 En attente de messages RabbitMQ...")
        channel.start_consuming()

    except Exception as e:
        print(f"❌ Impossible de démarrer le consommateur : {e}")