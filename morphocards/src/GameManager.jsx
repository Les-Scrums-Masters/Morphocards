import React, {useState, useEffect, useCallback} from 'react';
import GameContext from './GameContext'
import Firebase from './Firebase'
import Modal from './components/modal'
import './css/index.css'

import Loading from './components/Loading';

const GLOBAL_ROUND = 3;

let ACTUAL_ROUND = 0;
let HAND_SIZE = 6;

const wordSuccessEmoji = [String.fromCodePoint(0x1F600),
  String.fromCodePoint(0x1F603),
  String.fromCodePoint(0x1F601),
  String.fromCodePoint(0x1F60A),
  String.fromCodePoint(0x1F970)];
const wordSuccessTitles = ['Bien joué !', 'Trop fort !', 'Bravo !', 'C\'est ça !']
  
  
const winEmojis = [String.fromCodePoint(0x1F60D),
  String.fromCodePoint(0x1F929),
  String.fromCodePoint(0x1F60B),
  String.fromCodePoint(0x1F920),
  String.fromCodePoint(0x1F973),
  String.fromCodePoint(0x1F60E)];
const winTitles = ['Partie terminée !', 'Félicitations !', 'C\'etait une belle partie !', 'Belle performance !']
  
const winFailedEmojis = [String.fromCodePoint(0x1F612),
  String.fromCodePoint(0x1F644),
  String.fromCodePoint(0x1F62C),
  String.fromCodePoint(0x1F614),
  String.fromCodePoint(0x1F915),
  String.fromCodePoint(0x1F974),
  String.fromCodePoint(0x1F61F),
  String.fromCodePoint(0x1F641),
  String.fromCodePoint(0x1F615)];
const wordFailedTitles = ['Dommage !', 'Retente ta chance !', 'va voir gossa', 'Mince', 'Misèricorde', 'oups', 'Ce n\'est pas ça !']


export default function GameManager(props) {

  const [handCards, setHandCards] = useState([]);
  const [words, setWords] = useState([]);

  const [modalEmoji, setModalEmoji] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  


//Envoie un mot qui n'as pas déjà été selectionner
  let getRandomWord = (allWords) => {
    let random = Math.floor(Math.random() * allWords.length);
    while(words.includes( allWords[random] )){
      random = Math.floor(Math.random() * allWords.length);
    }
    return allWords[random];
  }


  /*Procédure qui permet de remplir la variable de state : words
  * Qui contiendra une liste de mot qui correspondront pour chaque partie
  *         le mot attendu à la ième partie

  * param : allWords : tout les mots de notre base de données
  */
  let setRandomListWords = (allWords) => {
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ) {
      words.push( getRandomWord(allWords) );
    }
  }


  /*Procédure qui permet de remplir la variable de state : handCards
  * Qui contiendra une liste de liste de "cartes main" qui correspondront pour chaque partie
  *         la main du joueur à la ième partie
  *
  *
  * param : allWords : tout les mots de notre base de données
  */
  let setRandomListHandCards = (allHandCards) => {
    //Une liste de toutes les mains de toutes les parties
    let handCardsList = [];
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ){

      //Liste des cartes main d'un seul round
      let handCards = [];

      //Ajout des cartes qui sont les bonnes réponses
      words[i].cards.map((card, index) => {
        if(!card.isBoard){
          handCards.push( getHandCard( card.value.id, allHandCards) )
        }
        return 0
      });

      //Rempli la main jusqu'à atteindre la taille de la main défini
      while(handCards.length < HAND_SIZE){
        handCards.push(getRandomCard(allHandCards, handCards));
      }

      //Mélange la main -> permet de ne pas avoir les bonnes cartes toujours au début
      shuffle(handCards);

      //Affection d'une position à chaque carte
      handCards.map( (card, index) =>(
        card.position = index
      ));

      handCardsList.push(handCards);
    }

    setHandCards(handCardsList);

  }

  /*Fonction qui retourne une carte parmis allHandCards qui n'est pas inclus dans myHandCards
  *
  * param : allHandCards : toutes les cartes main de notre base de données
  *         myHandCards : les cartes présent dans une des main
  */
  let getRandomCard = (allHandCards, myHandCards) => {
    let random = Math.floor(Math.random() * allHandCards.length);
    while(myHandCards.includes( allHandCards[random] )){
      random = Math.floor(Math.random() * allHandCards.length);
    }
    return allHandCards[random];
  }

   /*Fonction qui retourne la carte qui a la valeur "value"
  *
  * param : allHandCards : toutes les cartes main de notre base de données
  *         value : valeur de la carte recherché
  */
  let getHandCard = (value, allHandCards) =>{
    let i = 0;
    while(allHandCards[i].id !== value){
      i++
    }
    return allHandCards[i];
  }
  
  let appWin = () => {
    if (ACTUAL_ROUND === GLOBAL_ROUND-1) {
      // Victoire
      
      setModalTitle(pickRandomList(winTitles));
      setModalEmoji(pickRandomList(winEmojis));
      setModalOpen(true);

    } else {
      // Mot juste

      setModalTitle(pickRandomList(wordSuccessTitles));
      setModalEmoji(pickRandomList(wordSuccessEmoji));
      setModalOpen(true);

    }

  }

  let pickRandomList = (list) => {
    return list[Math.floor(Math.random() * list.length)];
  }

  let appFail = (playerWord) => {
    setModalTitle(pickRandomList(wordFailedTitles));
    setModalEmoji(pickRandomList(winFailedEmojis));
    setModalOpen(true);
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [initialSpreech, setInitialSpreech] = useState(false);
    const getData = useCallback(async () => {
      let allHandCards = await Firebase.getHandCards();
      
      let words = await Firebase.getWords();
  
      setRandomListWords(words);
      setRandomListHandCards(allHandCards);
  }, [setRandomListHandCards, setRandomListWords])

    // Au lancement, le mot est dit une première fois
    useEffect(() => {
      if (!initialSpreech) {
        setInitialSpreech(true);
        getData();
      }
    }, [initialSpreech, getData])

    let closeModal = () => setModalOpen(false);

    if(handCards.length === 0 && words.length === 0 ){
      return (
        <Loading />
      )
    } else{
      return(
        <div>
          <Modal open={modalOpen} 
          onClose={closeModal} 
          emoji={modalEmoji} title={modalTitle} word={words[ACTUAL_ROUND].id}/>
          <GameContext handCards={handCards[ACTUAL_ROUND]} word={words[ACTUAL_ROUND]} onWin={appWin} onFail={appFail} />
        </div>
      );
    }

}


//mélange un tableau
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
