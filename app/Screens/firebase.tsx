import { initializeApp } from "firebase/app";
import "firebase/database";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { getFirestore, collection, getDocs  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRs-l2ZvJ6zhZHvflv7_Nr7kVrZ6VaYxM",
  authDomain: "goldencoupon-da81c.firebaseapp.com",
  databaseURL: "https://goldencoupon-da81c-default-rtdb.firebaseio.com",
  projectId: "goldencoupon-da81c",
  storageBucket: "goldencoupon-da81c.firebasestorage.app",
  messagingSenderId: "135122691511",
  appId: "1:135122691511:web:62744221a58689ce633432",
  measurementId: "G-E7WH6V7B3E"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const store = getFirestore(app);

export { db, store, onValue, ref };
