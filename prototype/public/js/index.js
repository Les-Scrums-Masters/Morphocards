console.log("Script lancé");



//Longueur d'une partie
const HAND_LENGTH = 5;

//Objectif d'une partie (nombre de mots à trouver)
const GAME_LENGTH = 5;

//Score du joueur dans la partie courante
let score = 0;

//Round courant dans la partie courante
let round = 0;

//Listes des mots à trouver
let words = {}

//Listes des cartes que le joueur peut avoir dans la main (préfixes/suffixes)
let handCards = []

//Listes des cartes qui seront placé automatiquement (radical)
let boardCards = []


//Nouvelles listes des nouveaux mots --> changement d'axe de jeu
let wordsV2 = {}
let cardsV2 = {}
let cardTab = []

let roundBar = document.getElementById('roundBar');
let scoreBar = document.getElementById('scoreBar');
let board = document.getElementById('board');


// Fonction d'obtention des données
async function getData() {
  let wordSnapshot = await WORDS_COLLECTION.get();
  let handSnapshot = await CARDHAND_COLLECTION.get();
  let boardSnapshot = await CARDBOARD_COLLECTION.get();

  let wordv2Snapshot = await WORDSV2_COLLECTION.get();
  wordv2Snapshot.forEach(element => {
    wordsV2[element.id] = element.data();
  });

  let handV2Snapshot = await CARDHANDV2_COLLECTION.get();
  handV2Snapshot.forEach(element => {
    cardTab.push(element.id);
    cardsV2[element.id] = element.data();
  });

   wordSnapshot.forEach(element => {
     words[element.id] = element.data();
   });


   handSnapshot.forEach(element => {
     handCards.push(element.id);
   })

   boardCards.forEach(element => {
     boardCards.push(element.id);
   })

   console.log("Données récupérés");

   // Une fois les données obtenues, lancement du jeu :
   play();

}

/** Jeu **/
function play(){

  round++;

  scoreBar.innerHTML = "Réponse juste : " + score + "/" + (round-1);
  roundBar.innerHTML = round + "/" + GAME_LENGTH;

  //mot à trouver choisi au hasard dans la listes des mots (words)
  let key = Math.floor(Math.random()*words.length);
  let word = getRandomWord(words);


  let wordV2 = getRandomWord(wordsV2);
  console.log("Mot : " + wordV2);
  getGoodCards(wordV2);

  //radical correspondant au mot choisi
  let radical = words[word].root.id;
  //bonne réponse à mettre
  let goodCard = (words[word].prefix) ? words[word].prefix.id : words[word].suffix.id;
  //document.getElementById("radical").innerHTML = radical;



  //List de toutes les cartes initial composant le mots
  let initList = wordsV2[wordV2].boardCard;
  console.log(initList);
  initList.forEach((element) => {
  });

  //Simulation donc à changer !!! --------------
  let word1 = document.createElement('p');
  word1.innerHTML = "m";
  board.appendChild(word1);

  let emptyCase1 = document.createElement('input');
  emptyCase1.id = "emptyCase1";
  emptyCase1.type = "radio";
  emptyCase1.name = "placement";
  board.appendChild(emptyCase1);

  let word2 = document.createElement('p');
  word2.innerHTML = "g";
  board.appendChild(word2);

  let emptyCase2 = document.createElement('input');
  emptyCase2.id = "emptyCase2";
  emptyCase2.type = "radio";
  emptyCase2.name = "placement";
  board.appendChild(emptyCase2);
  //Simulation fini ----------------------------



  let hand = document.getElementById("btn_container");
  hand.innerHTML = "";

  //Liste qui va contenir nos X cartes
  //let currentHand = [goodCard];

  let currentHand = getGoodCards(wordV2);
  let nbGoodCards = currentHand.length;

  //let random = Math.floor(Math.random()* (handCards.length-1));
  let random = Math.floor(Math.random()* (cardTab.length-1));
  //CONSITUTION DE LA MAIN
  //Donne une distribution de clé aléatoire avec 1 seule bonne
  for (let i = 0; i < HAND_LENGTH - nbGoodCards; i++) {
    /*cardsV2
    //Tant que la carte n'est pas déjà présente
    while( currentHand.includes(handCards[random])){
      //Avoir un clé du tableau handCards
      random = Math.floor(Math.random()* (handCards.length-1));
    }*/



    //Tant que la carte n'est pas déjà présente

    while( currentHand.includes(cardTab[random])){
      console.log(cardTab[random]);
      //Avoir un clé du tableau handCards
      random = Math.floor(Math.random()* (cardTab.length));
    }

    //console.log(random + " " + handCards[random]);
    //currentHand.push(handCards[random])
    currentHand.push(cardTab[random]);;
  }

  //Mélange de la main
  shuffle(currentHand);

  //Fonction exécuté lorsqu'on clique sur une carte
  var cardClicked = function(){

    //Verification si le radioButton de gauche ou de droite à été choisi
    //Dans ce cas, this est la carte selectionné
    let userWord = (document.getElementById("right").checked)
      ? radical + this.innerHTML
      : this.innerHTML + radical;

    if(userWord in words){
      alert("gagné " + userWord);
      score++;
    } else{
      alert("perdu c'etait : "+ word + " au lieu de " + userWord);
    }

    if(round == GAME_LENGTH){
      alert("Partie fini, vous avez trouvé " + score +" mot(s)");
      round = 0;
      score = 0;
    }
    play();
  }

  //Affichages des cartes
  for (let i = 0; i < HAND_LENGTH; i++) {
    //Placement des cartes
    let button = document.createElement("button");
    button.onclick = cardClicked;
    button.innerHTML = currentHand[i];
    hand.appendChild(button);
  }

}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomWord(obj) {
  var keys = Object.keys(obj);
  return keys[ keys.length * Math.random() << 0];
};

function getGoodCards(word){
  let goodCards = [];
  let initList = wordsV2[word].handCard;
  initList.forEach(element => {

    for (const [key, value] of Object.entries(cardsV2)) {
        for (const [key2, value2] of Object.entries(cardsV2[key])) {
          value2.forEach((item) => {
            if(item == element){
              console.log(item + " " + key);
              goodCards.push(key);
            }
          });
          }
      }
  });
  return goodCards;
}

// Au lancement, récupérer les données :
getData();
