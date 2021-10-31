console.log("Script lancé");

const HAND_LENGTH = 5;

//Objectif d'une partie (nombre de mots à trouver)
const GAME_LENGTH = 5;

//Score du joueur dans la partie courante
let score = 0;

//Round courant dans la partie courante
let round = 0;

//Listes des mots à trouver
let words = [
  "bijoutier",
  "coiffeur",
  "chanteur",
  "boulanger",
  "absenteisme",
  "alcoolique",
  "allergique",
  "sismique"
]

//Listes des cartes que le joueur peut avoir dans la main (préfixes/suffixes)
let handCards = [
  "tier",
  "eur",
  "ger",
  "eisme",
  "lique",
  "gique",
  "ique"
]

//Listes des cartes qui seront placé automatiquement (radical)
let boardCards = [
  "bijou",
  "coiff",
  "chant",
  "boulan",
  "absent",
  "alcoo",
  "aller",
  "sism"
]

//association entre la table words avec handCards/boardCards
let association = [
  [handCards[0], boardCards[0]],
  [handCards[1], boardCards[1]],
  [handCards[1], boardCards[2]],
  [handCards[2], boardCards[3]],
  [handCards[3], boardCards[4]],
  [handCards[4], boardCards[5]],
  [handCards[5], boardCards[6]],
  [handCards[6], boardCards[7]]
]

let scoreBar = document.getElementById('scoreBar');

/** Nouvelle partie **/
function newGame(){
  round++;
  scoreBar.innerHTML = round + "/" + GAME_LENGTH;


  //mot à trouver choisi au hasard dans la listes des mots (words)
  let key = Math.floor(Math.random()*words.length);
  let word = words[key];

  //radical correspondant au mot choisi
  let radical = association[key][1];

  //bonne réponse à mettre
  let goodCard = association[key][0];


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
    let userWord
    if (document.getElementById("right").checked) {
      userWord = radical + this.innerHTML;
    } else{
      userWord = this.innerHTML + radical;
    }
    if(userWord == word){
      alert("gagné " + word);
      score++;
    } else{
      alert("perdu c'etait : "+ word + " au lieu de " + userWord);
    }

    if(round == GAME_LENGTH){
      alert("Partie fini, vous avez trouvé " + score +" mot(s)");
      round = 0;
      score = 0;
    }
    newGame();
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
newGame();
