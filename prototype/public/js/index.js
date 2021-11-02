console.log("Script lancé");

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

let scoreBar = document.getElementById('scoreBar');

// Fonction d'obtention des données
async function getData() {
  let wordSnapshot = await WORDS_COLLECTION.get();
  let handSnapshot = await CARDHAND_COLLECTION.get();
  let boardSnapshot = await CARDBOARD_COLLECTION.get();

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

  scoreBar.innerHTML = round + "/" + GAME_LENGTH;

  //mot à trouver choisi au hasard dans la listes des mots (words)
  let key = Math.floor(Math.random()*words.length);

  let word = getRandomWord(words);

  console.log("Mot : " + word);

  //radical correspondant au mot choisi
  let radical = words[word].root.id;

  console.log("Radical : " + radical);

  //bonne réponse à mettre
  let goodCard = (words[word].prefix) ? words[word].prefix.id : words[word].suffix.id;

  document.getElementById("radical").innerHTML = radical;
  let hand = document.getElementById("btn_container");
  hand.innerHTML = "";

  //Liste qui va contenir nos X cartes
  let currentHand = [goodCard];

  let random = Math.floor(Math.random()* (handCards.length-1));

  //CONSITUTION DE LA MAIN
  //Donne une distribution de clé aléatoire avec 1 seule bonne
  for (let i = 0; i < HAND_LENGTH - 1; i++) {

    //Tant que la carte n'est pas déjà présente
    while( currentHand.includes(handCards[random])){
      //Avoir un clé du tableau handCards
      random = Math.floor(Math.random()* (handCards.length-1));
    }

    console.log(random + " " + handCards[random]);
    currentHand.push(handCards[random]);
  }
  console.log(currentHand);

  //Mélange de la main
  shuffle(currentHand);

  //Fonction exécuté lorsqu'on clique sur une carte
  var cardClicked = function(){

    //Verification si le radioButton de gauche ou de droite à été choisi
    //Dans ce cas, this est la carte selectionné
    let userWord = (document.getElementById("right").checked) 
      ? radical + this.innerHTML
      : userWord = this.innerHTML + radical;

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

// Au lancement, récupérer les données :
getData();