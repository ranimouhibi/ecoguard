// RealTimeCharts.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const RealTimeCharts = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [noiseData, setNoiseData] = useState([]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date) ? date.toLocaleTimeString() : "Invalid";
  };

  const fetchTemperatureData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/temperature");
      const formatted = res.data.map((d) => ({
        temperature: d.temperature,
        time: formatTime(d.timestamp),
      }));
      setTemperatureData(formatted.reverse()); // reverse to get oldest first
    } catch (err) {
      console.error("Erreur température:", err.message);
    }
  };

  const fetchNoiseData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/noise");
      const formatted = res.data.map((d) => ({
        noise: d.noiseLevel,
        time: formatTime(d.timestamp),
      }));
      setNoiseData(formatted.reverse()); // reverse to get oldest first
    } catch (err) {
      console.error("Erreur bruit:", err.message);
    }
  };

  useEffect(() => {
    fetchTemperatureData();
    fetchNoiseData();
    const interval = setInterval(() => {
      fetchTemperatureData();
      fetchNoiseData();
    }, 5000); // rafraîchir toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Température (°C)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Bruit (dB)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={noiseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="noise" stroke="#00c49f" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeCharts;
