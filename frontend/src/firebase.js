import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
apiKey: "AIzaSyAMxpa94ukanQKrtnMrVKz2Enhq37esaVE",
authDomain: "pfe-anomaly-e43fb.firebaseapp.com",
databaseURL: "https://pfe-anomaly-e43fb-default-rtdb.firebaseio.com",
projectId: "pfe-anomaly-e43fb",
storageBucket: "pfe-anomaly-e43fb.appspot.com", // corrigé ici
messagingSenderId: "168938722119",
appId: "1:168938722119:web:b516a90bc28150a65b7262",
measurementId: "G-201Y6PQEGF",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };