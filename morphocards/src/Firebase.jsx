import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc} from 'firebase/firestore/lite';
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
    this.USERS_COLLECTION = collection(db, "users");

    FirebaseClass.instance = this;
   }

   return FirebaseClass.instance;
  }


  async addUserRound(rounds,time) {

    //Récupère le document de l'utilisateur
    let docRef = doc(this.USERS_COLLECTION, Firebase.auth.currentUser.uid );
    //let docSnap = await getDoc(docRef);
    //Récupère les parties de ce joueur
    let gameCollection = await collection(docRef, "games" );


    //Getting the biggest id
    /*
    let allGamesDoc = await getDocs( gameCollection );
    let biggestId = 0;
    console.log(allGamesDoc);
    allGamesDoc.forEach((element) =>{
      if(biggestId > element.id){
        biggestId = element.id;
      }
    });
    biggestId++;
    console.log(biggestId+1);

    let data = {
      rounds:rounds,
      time:time
    }

    console.log(data);
    let newDocRef = doc( gameCollection, 2 );

    await setDoc(newDocRef, {
      rounds: data
    });

    let pushRound = [];*/

    /*

    // Conversion des cartes plateau en références :
    let newCards = []

    item.cards.forEach((element) => {
      if(element.isBoard) {
        newCards.push(element);
      } else {
        let cardRef = doc(this.CARDHAND_COLLECTION, element.value);
        newCards.push({isBoard: element.isBoard, value: cardRef});
      }
    })

    await setDoc(docRef, {
      cards: newCards
    });*/
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
    docs.forEach((element) =>{
      list.push(new WordModel(element.id, element.data()['cards']));
    } );
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
