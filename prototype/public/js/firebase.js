const db = firebase.firestore();

// Récupération des collections :
const CARDBOARD_COLLECTION = db.collection("cards_board");
const CARDHAND_COLLECTION = db.collection("cards_hands");
const WORDS_COLLECTION = db.collection("words");