import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyB5gCJGS43qQm7AE3XYgNlslh7bSyb2yCY",
  authDomain: "task-manager-94437.firebaseapp.com",
  projectId: "task-manager-94437",
  storageBucket: "task-manager-94437.appspot.com",
  messagingSenderId: "911924001158",
  appId: "1:911924001158:web:7dfb33234af2885f891407"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
