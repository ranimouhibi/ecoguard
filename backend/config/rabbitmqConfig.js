// config/rabbitmqConfig.js
const amqp = require("amqplib");
require("dotenv").config();

const RABBITMQ_URI = process.env.RABBITMQ_URI || "amqp://localhost";
const QUEUE_NAME_TEMP = process.env.QUEUE_NAME_TEMP || "temperature_data";
const QUEUE_NAME_NOISE = process.env.QUEUE_NAME_NOISE || "noise_data";

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME_TEMP, { durable: true });
    await channel.assertQueue(QUEUE_NAME_NOISE, { durable: true });
    console.log("✅ Connecté à RabbitMQ");
  } catch (error) {
    console.error("❌ Erreur de connexion à RabbitMQ:", error);
  }
};

const publishToQueue = (queueName, data) => {
  if (channel) {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    console.log(`📬 Donnée envoyée à RabbitMQ sur le queue ${queueName}:`, data);
  }
};

module.exports = { connectRabbitMQ, publishToQueue, QUEUE_NAME_TEMP, QUEUE_NAME_NOISE };