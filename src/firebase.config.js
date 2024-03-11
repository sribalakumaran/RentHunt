// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2aTRDZ1ekkfVtn6vKTS94v172AkDz0nM",
    authDomain: "renthunt-2bdfb.firebaseapp.com",
    projectId: "renthunt-2bdfb",
    storageBucket: "renthunt-2bdfb.appspot.com",
    messagingSenderId: "600441768015",
    appId: "1:600441768015:web:cc319372481e088264823a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

// const fstore = firebase.firestore(); 
// export { fstore }; 

//export default firebase;