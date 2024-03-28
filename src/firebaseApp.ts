import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC51z-RVrNc8fPzq7WObo4M-l5wNjbQjzI",
  authDomain: "csx-dashboard-3d49b.firebaseapp.com",
  databaseURL: "https://csx-dashboard-3d49b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "csx-dashboard-3d49b",
  storageBucket: "csx-dashboard-3d49b.appspot.com",
  messagingSenderId: "522378853797",
  appId: "1:522378853797:web:b5540b101521c92235fc4c",
  measurementId: "G-WEYP0FREQ3"
}

const app = initializeApp(firebaseConfig);

export default app;