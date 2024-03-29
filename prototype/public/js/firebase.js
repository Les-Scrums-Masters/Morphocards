// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIy172a-eDssYLn7uTCPvUlHLzrtOvV5s",
    authDomain: "morphocards-3976f.firebaseapp.com",
    projectId: "morphocards-3976f",
    storageBucket: "morphocards-3976f.appspot.com",
    messagingSenderId: "1048733341127",
    appId: "1:1048733341127:web:39a31dd14a61a4f6d2b5e2"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Récupération des collections :
const WORDSV2_COLLECTION = db.collection("wordsV2");
const CARDHANDV2_COLLECTION = db.collection("cards_handV2");
