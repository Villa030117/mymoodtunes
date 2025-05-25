import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "XXXXXXXXX",
  appId: "1:XXXXXXXX:web:XXXXXXXX"
};

const app = initializeApp(firebaseConfig);

export default app;