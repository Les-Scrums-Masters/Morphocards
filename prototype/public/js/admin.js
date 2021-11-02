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
        boardCards.appendChild(makeItem(element.id));
        wordBoard.appendChild(makeOption(element.id));
        wordArray.push(element.id);
    });

    // Pour chaque carte main
    hand.docs.forEach(element => {
        handCards.appendChild(makeItem(element.id));
        wordPrefix.appendChild(makeOption(element.id));
        wordSuffix.appendChild(makeOption(element.id));
        handArray.push(element.id);
    });

    // Pour chaque mot
    words.docs.forEach(element => {
        wordList.appendChild(makeItem(element.id));
        wordArray.push(element.id);
    });
}

// Fonction de création d'un objet d'une liste
function makeItem(text) {
    let item = document.createElement("li");
    item.innerHTML = text;
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


// Au lancement, associer les boutons d'ajout à l'évènement
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


// Puis récupérer les données
getData();