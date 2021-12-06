// Création des listes
let boardArray = [];
let handArray = [];
let wordArray = [];

// Récupération des listes
const boardCards = document.querySelector("#boardList");
const handCards = document.querySelector("#handList");
const wordList = document.querySelector("#wordList");

// Récupération des champs du formulaire
const boardInput = document.querySelector("#boardInput");
const handInput = document.querySelector("#handInput");
const wordPrefix = document.querySelector("#words-prefix");
const wordBoard = document.querySelector("#words-board");
const wordSuffix = document.querySelector("#words-suffix");

// Récupréation des messages d'erreurs
const boardError = document.querySelector("#boardError");
const handError = document.querySelector("#handError");
const wordError = document.querySelector("#wordError");

// Récupération des sections de l'interface
const adminLoader = document.querySelector("#admin-loader");
const adminLogin = document.querySelector("#admin-login");
const adminContent = document.querySelector("#admin-content");

// Récupération des éléments de gestion de l'utilisateur
const userSection = document.querySelector("#current-user");
const userIdLabel = document.querySelector("#user-id");
const logoutBtn = document.querySelector("#logout-btn");

// Cacher le contenu de l'interface avant la connexion
adminContent.style.display = 'none';
userSection.style.display = 'none';

// Initialisation de l'authentification firebase
const auth = firebase.auth();
var ui = new firebaseui.auth.AuthUI(auth);
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            return false;
        },
        uiShown: function() {
            adminLoader.style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };

function renderLogin() {
    ui.start('#admin-login', uiConfig);
}
  
renderLogin();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;

        console.log("Logged !")
        console.log(user);
        
        userIdLabel.innerHTML = uid;

        adminContent.style.display = 'flex';
        adminLogin.style.display = 'none';
        userSection.style.display = 'inline-block';
        
    } else {
        console.log("Signed out !")

        adminContent.style.display = 'none';
        adminLogin.style.display = 'block';
        userSection.style.display = 'none';

        renderLogin();
    }
  });

// Fonction d'obtention des données
async function getData() {
    // Vider les listes
    boardCards.innerHTML="";
    handCards.innerHTML="";
    wordList.innerHTML="";
    boardArray = [];
    handArray = [];
    wordArray = [];

    // Vider les combobox
    wordPrefix.innerHTML = "<option value=\"\">--Choisir--</option>";
    wordBoard.innerHTML = "<option value=\"\">--Choisir--</option>";
    wordSuffix.innerHTML = "<option value=\"\">--Choisir--</option>"

    // Récupération du contenu des collections
    let board = await CARDBOARD_COLLECTION.get();
    let hand = await CARDHAND_COLLECTION.get();
    let words = await WORDS_COLLECTION.get();

    // Pour chaque carte plateau
    board.docs.forEach(element => {
        boardCards.appendChild(makeItem(element.id, CARDBOARD_COLLECTION));
        wordBoard.appendChild(makeOption(element.id));
        boardArray.push(element.id);
    });

    // Pour chaque carte main
    hand.docs.forEach(element => {
        handCards.appendChild(makeItem(element.id, CARDHAND_COLLECTION));
        wordPrefix.appendChild(makeOption(element.id));
        wordSuffix.appendChild(makeOption(element.id));
        handArray.push(element.id);
    });
    
    // Pour chaque mot
    words.docs.forEach(element => {
        wordList.appendChild(makeItem(element.id, WORDS_COLLECTION));
        wordArray.push(element.id);
    });
}

// Fonction de création d'un objet d'une liste
function makeItem(id, collection) {
    let item = document.createElement("li");

    let text = document.createElement("p");
    text.innerHTML = id;

    let remove = document.createElement("button");
    remove.innerHTML = "x";
    remove.onclick = function() {
        deleteCard(id, collection);
    }

    item.appendChild(text);
    item.appendChild(remove);

    return item;
}

// Fonction de création d'un objet pour une combobox
function makeOption(text) {
    let item = document.createElement("option");
    item.innerHTML = text;
    item.value = text;
    return item;
}

// Fonction d'ajout d'une carte de plateau
function addBoardCard(card) {

    if (boardArray.includes(card)) {
        throw new Error("Cette carte existe déjà");
    }

    CARDBOARD_COLLECTION.doc(card).set({value: card});
    boardInput.value = "";
    boardInput.focus();
}

// Fonction d'ajout d'une carte de main
function addHandCard(card) {

    if (handArray.includes(card)) {
        throw new Error("Cette carte existe déjà");
    }

    CARDHAND_COLLECTION.doc(card).set({value: card});
    handInput.value = "";
    handInput.focus();
}

// Fonction d'ajout d'un nouveau mot
function addWord(prefix, board, suffix) {
    if (prefix && board && suffix) {
        throw new Error("Vous ne pouvez définir uniquement un préfix OU un suffix");
    } else if (!board) {
        throw new Error("Vous devez définir une carte plateau");
    } else if (!prefix && !suffix) {
        throw new Error("Veuillez définir au moins un suffix ou un prefix");
    } else if (!prefix && !board && !suffix) {
        throw new Error("Veuillez remplir au moins une carte plateau et un préfix ou suffix")
    }

    let id = prefix+board+suffix;

    if (wordArray.includes(id)) {
        throw new Error("Ce mot existe déjà !");
    }

    let data = {root: CARDBOARD_COLLECTION.doc(board)};
    if (prefix) data["prefix"] = CARDHAND_COLLECTION.doc(prefix);
    if (suffix) data["suffix"] = CARDHAND_COLLECTION.doc(suffix)

    WORDS_COLLECTION.doc(id).set(data);

}

// Fonction de suppression d'une carte
function deleteCard(id, collection){
  collection.doc(id).delete();
  getData();


  switch (collection) {
    case CARDHAND_COLLECTION:
      if(handArray.includes(id)){
        throw new Error("Suppression de la carte préfixe " + id + " échouée");
      }
      break;
    case CARDBOARD_COLLECTION:
      if(boardArray.includes(id)){
        throw new Error("Suppression de la carte radicale " + id + " échouée");
      }
    default:
      if(wordArray.includes(id)){
        throw new Error("Suppression du mot " + id + " échouée");
      }
  }

}

// Au lancement, associer les boutons d'ajout à l'évènement :
// Bouton d'ajout d'une carte plateau
document.querySelector("#boardForm").addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        addBoardCard(boardInput.value);
        boardError.innerHTML = "";
        getData();
    } catch (e) {
        boardError.innerHTML = e;
    }
});

// Bouton d'ajout d'une carte main
document.querySelector("#handForm").addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        addHandCard(handInput.value);
        handError.innerHTML = "";
        getData();
    } catch (e) {
        handError.innerHTML = e;
    }
});

// Bouton d'ajout d'un mot
document.querySelector("#wordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        addWord(wordPrefix.value, wordBoard.value, wordSuffix.value)
        wordError.innerHTML="";
        getData();
    } catch (e) {
        wordError.innerHTML = e;
    }
});

// Bouton déconnexion
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    auth.signOut();
});

// Puis récupérer les données
getData();
