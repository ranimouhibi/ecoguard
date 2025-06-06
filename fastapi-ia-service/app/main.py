from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import threading
from datetime import datetime
from rabbitmq_consumer import start_consumer
from utils import temperature_history, noise_history

app = FastAPI()

# CORS — à adapter selon l'adresse de ton frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://127.0.0.1"],  # Autorise localhost:3000 pour dev React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Démarrage du consommateur RabbitMQ en thread
@app.on_event("startup")
def start_background_thread():
    thread = threading.Thread(target=start_consumer)
    thread.daemon = True
    thread.start()

@app.get("/")
def index():
    return {
        "status": "running",
        "message": "✅ API IA de détection des anomalies est en cours d'exécution et prête à recevoir des données."
    }

# --- Dernières données ---
@app.get("/api/latest")
def get_latest():
    if not temperature_history or not noise_history:
        return JSONResponse(
            status_code=404,
            content={
                "status": "empty",
                "message": "🚫 Aucune donnée disponible."
            }
        )
    return {
        "status": "ok",
        "temperature": temperature_history[-1],
        "noise": noise_history[-1]
    }

# --- Historique des données ---
@app.get("/api/history")
def get_history():
    return {
        "status": "ok",
        "temperature_history": temperature_history[-100:],
        "noise_history": noise_history[-100:]
    }

# --- Modèle Pydantic pour une alerte ---
class Alert(BaseModel):
    id: int
    type: str
    description: str
    timestamp: datetime

# --- Liste d'alertes en mémoire (exemple) ---
alerts_data = [
    Alert(id=1, type="temp_high", description="Température trop élevée (85°C)", timestamp=datetime.now()),
    Alert(id=2, type="noise_low", description="Bruit trop faible (40 dB)", timestamp=datetime.now()),
]

# --- Endpoint pour récupérer les alertes ---
@app.get("/api/alerts", response_model=List[Alert])
def get_alerts():
    return alerts_data
