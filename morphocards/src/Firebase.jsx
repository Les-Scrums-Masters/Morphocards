import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import HandCardModel from './models/HandCardModel';
import WordModel from './models/WordModel';

class FirebaseClass {

  db;
  auth;
  uiConfig;

  constructor(){
   if(! FirebaseClass.instance){
     
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
    let app = initializeApp(firebaseConfig);
    let db = getFirestore(app);
    let auth = getAuth(app);
    this.db = db;
    this.auth = auth;

    // Init firebaseui
    this.uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    return false;
                },
                // uiShown: function() {}
            },
            signInFlow: 'popup',
            signInOptions: [
              GoogleAuthProvider.PROVIDER_ID,
            ],
          };

    // Récupération des collections :
    this.CARDHAND_COLLECTION = collection(db, "cards_handV2");
    this.WORDS_COLLECTION = collection(db, "wordsV2");

    FirebaseClass.instance = this;
   }

   return FirebaseClass.instance;
  }

  async getHandCards() {
    let list = [];
    let docs = await getDocs(this.CARDHAND_COLLECTION);
    docs.forEach((element) => list.push(new HandCardModel(element.id, element.data()['value'])));
    return list;
  }

  async getWords() {
    let list = [];
    let docs = await getDocs(this.WORDS_COLLECTION);
    docs.forEach((element) => list.push(new WordModel(element.id, element.data()['cards'])));
    return list;
  }

  refToString(item) {
    if (item.path) {
      return item.path.split('/')[1];
    } else {
      return "..."
    }
  }

}

const Firebase = new FirebaseClass();
Object.freeze(Firebase);

export default Firebase;