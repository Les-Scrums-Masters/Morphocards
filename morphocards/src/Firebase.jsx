import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider, signOut  } from "firebase/auth";
import HandCardModel from './models/HandCardModel';
import WordModel from './models/WordModel';
import GameModel from './models/GameModel';

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


  // Fonction qui enregistre une partie de l'utilisateur
  async saveGame(rounds,time) {

    // Récupère le document de l'utilisateur
    let docRef = doc(this.USERS_COLLECTION, Firebase.auth.currentUser.uid );

    // Récupération du numéro de partie de partie de l'utilisateur
    let docSnap = await getDoc(docRef);

    // Création de la variable du numéro de partie
    let gameId = 0;

    let alreadyIncremend = false;
    if (docSnap.exists()) {
      // Le document existe, on défini le numéro de la partie à enregistrer
      gameId = docSnap.get('gameId') + 1;
    } else {
      // Le document n'existe pas, on le crée
      alreadyIncremend = true;
      await setDoc(docRef, {gameId: 1});
    }

    // Récupère les parties de ce joueur
    let gamesCollection = collection(docRef, "games");

    // Création des données de round
    let array = [];
    rounds.forEach((element) => {
      array.push(element.toMap());
    });

    console.log(array);

    // Données à enregistrer dans la base
    let data = {
      rounds: array,
      time:time ?? 0,
      date: Date.now()
    }

    // Création du document dans lequel stocker la partie
    let newDocRef = doc(gamesCollection, gameId.toString());

    // Enregistrement du document de la partie
    await setDoc(newDocRef, data);

    // Enregistrement du numéro de partie
    if (!alreadyIncremend) {
      await updateDoc(docRef, {gameId: gameId});
    }

  }

  async logOut() {
    await signOut(this.auth);
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

  async getGames(userId) {
    
    // Récupère le document de l'utilisateur
    let docRef = doc(this.USERS_COLLECTION, userId ?? Firebase.auth.currentUser.uid);

    // Récupérer la collection parties de l'utilisateur :
    let gamesCollection = collection(docRef, "games");

    // Récupérer la liste des parties
    let gameList = await getDocs(gamesCollection);

    // Si il n'y a pas de parties, on retourne une liste vide
    if (gameList.empty) {
      return [];
    } 

    // Création de la liste des résultats
    let results = [];

    // Pour chaque partie
    gameList.forEach((element)=> {
      let data = element.data();

      let game = new GameModel(element.id, data['date'], data['time'], data['rounds']);
      results.push(game);
    });
  
    return results;

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