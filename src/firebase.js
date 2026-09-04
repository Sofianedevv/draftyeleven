import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDftQo4FRRSVM-eevHcQ40_C07PZhIwA_A",
  authDomain: "draftyeleven.firebaseapp.com",
  databaseURL: "https://draftyeleven-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "draftyeleven",
  storageBucket: "draftyeleven.firebasestorage.app",
  messagingSenderId: "565123087829",
  appId: "1:565123087829:web:80f558c8a479fae037115c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

