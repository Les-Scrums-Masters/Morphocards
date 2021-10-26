console.log("Script lancé");

const HAND_LENGTH = 5;

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

let handCards = [
  "tier",
  "eur",
  "ger",
  "eisme",
  "lique",
  "gique",
  "ique"
]
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

/** Nouvelle partie **/
function newGame(){
  let key = Math.floor(Math.random()*words.length);

  //mot à trouver
  let word = words[key];

  //radical
  let radical = association[key][1];

  //bonne réponse à mettre
  let goodCard = association[key][0];
  console.log(goodCard);


  document.getElementById("radical").innerHTML = radical;
  let hand = document.getElementById("btn_container");
  hand.innerHTML = "";


  let currentHand = [key];
  let random = key

  //Donne une distribution de clé aléatoire avec 1 seule bonne
  for (let i = 0; i < HAND_LENGTH - 1; i++) {
    while( currentHand.includes(random)){
      random = Math.floor(Math.random()*handCards.length);
    }
    currentHand.push(random);
  }
  shuffle(currentHand);

  var cardClicked = function(){
    let userWord = radical + this.innerHTML;
    if(userWord == word){
      alert("gagné " + word);
    } else{
      alert("perdu c'etait : "+word + " au lieu de " + userWord);
    }
    newGame();
  }

  for (let i = 0; i < HAND_LENGTH; i++) {
    //Placement des cartes
    let button = document.createElement("button");
    button.onclick = cardClicked;
    button.innerHTML = association[currentHand[i]][0];
    hand.appendChild(button);
  }


}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
newGame();
