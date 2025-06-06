from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self, temp_bounds=(10, 90), noise_bounds=(45, 85)):
        self.model_temp = IsolationForest(contamination=0.1)
        self.model_noise = IsolationForest(contamination=0.1)
        self.fitted = False
        self.temp_min, self.temp_max = temp_bounds
        self.noise_min, self.noise_max = noise_bounds

    def fit(self, temp_data, noise_data):
        self.model_temp.fit(np.array(temp_data).reshape(-1, 1))
        self.model_noise.fit(np.array(noise_data).reshape(-1, 1))
        self.fitted = True

    def detect(self, temperature, noise):
        if not self.fitted:
            return {
                "status": "error",
                "message": "🚫 Modèle non entraîné.",
                "anomalies": []
            }

        anomalies = []
        temp_result = self.model_temp.predict([[temperature]])[0]
        noise_result = self.model_noise.predict([[noise]])[0]

        # Seuils fixes
        if temperature < self.temp_min:
            anomalies.append({
                "type": "temp_low",
                "value": temperature,
                "difference": self.temp_min - temperature
            })
        elif temperature > self.temp_max:
            anomalies.append({
                "type": "temp_high",
                "value": temperature,
                "difference": temperature - self.temp_max
            })

        if noise < self.noise_min:
            anomalies.append({
                "type": "noise_low",
                "value": noise,
                "difference": self.noise_min - noise
            })
        elif noise > self.noise_max:
            anomalies.append({
                "type": "noise_high",
                "value": noise,
                "difference": noise - self.noise_max
            })

        # Anomalies Isolation Forest
        if temp_result == -1:
            anomalies.append({
                "type": "temp_anomaly",
                "value": temperature
            })
        if noise_result == -1:
            anomalies.append({
                "type": "noise_anomaly",
                "value": noise
            })

        if anomalies:
            return {
                "status": "alert",
                "message": "🚨 Anomalies détectées.",
                "anomalies": anomalies
            }
        else:
            return {
                "status": "ok",
                "message": "✅ Aucune anomalie détectée.",
                "anomalies": []
            }