// config/mqttConfig.js
const mqtt = require("mqtt");
require("dotenv").config();

const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://127.0.0.1:1883";
const MQTT_TOPIC_TEMP = process.env.MQTT_TOPIC_TEMP;
const MQTT_TOPIC_NOISE = process.env.MQTT_TOPIC_NOISE;

const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
  console.log("✅ Connecté au broker MQTT");
  client.subscribe([MQTT_TOPIC_TEMP, MQTT_TOPIC_NOISE], (err) => {
    if (err) {
      console.log("❌ Erreur lors de la souscription aux topics");
    } else {
      console.log(`📡 Abonné aux topics : ${MQTT_TOPIC_TEMP}, ${MQTT_TOPIC_NOISE}`);
    }
  });
});

module.exports = { client, MQTT_TOPIC_TEMP, MQTT_TOPIC_NOISE };
