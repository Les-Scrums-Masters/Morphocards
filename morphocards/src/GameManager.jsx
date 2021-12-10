import React, {useState, useEffect, useCallback} from 'react';
import GameContext from './GameContext'
import Firebase from './Firebase'
import Modal from './components/Modal'

import Loading from './components/Loading';
import GameBar from './components/GameBar';


// Contenu de la boite de dialogue si le mot est trouvé :
const wordSuccessEmoji = [String.fromCodePoint(0x1F600),
  String.fromCodePoint(0x1F603),
  String.fromCodePoint(0x1F601),
  String.fromCodePoint(0x1F60A),
  String.fromCodePoint(0x1F970)];
const wordSuccessTitles = ['Bien joué !', 'Trop fort !', 'Bravo !', 'C\'est ça !']
  
  
// Contenu de la boite de dialogue lorsque la partie est terminée :
const winEmojis = [String.fromCodePoint(0x1F60D),
  String.fromCodePoint(0x1F929),
  String.fromCodePoint(0x1F60B),
  String.fromCodePoint(0x1F920),
  String.fromCodePoint(0x1F973),
  String.fromCodePoint(0x1F60E)];
const winTitles = ['Partie terminée !', 'Félicitations !', 'C\'etait une belle partie !', 'Belle performance !']
  

// Contenu de la boite de dialogue lorsque qu'un mot n'est pas trouvé
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

  // Créations des variables d'états
  const [handCards, setHandCards] = useState([]);
  const [words, /*setWords*/] = useState([]);

  // Variables pour la boite de dialogue d'echec/succès
  const [modalEmoji, setModalEmoji] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalWrongWord, setModalWrongWord] = useState("");
  const [modalNextButtonText, setModalNextButtonText] = useState("");
  const [modalRestartAction, setModalRestartAction] = useState();
  const [modalNextAction, setModalNextAction] = useState();

  const [modalOpen, setModalOpen] = useState(false);

  // Variable qui vérifie si le mot à été prononcé une première fois
  const [initialSpreech, setInitialSpreech] = useState(false);

  // Nombre de round dans une partie :
  const GLOBAL_ROUND = 3;

  // Nombre de carte dans une main :
  const HAND_SIZE = 6;

  // Round actuel :
  const [actualRound, /*setActualRound*/] = useState(0);
  

  /* Fonction qui retourne une carte parmis allHandCards qui n'est pas inclus dans myHandCards
  *
  * param : allHandCards : toutes les cartes main de notre base de données
  *         myHandCards : les cartes présent dans une des main
  */
  const getRandomCard = useCallback((allHandCards, myHandCards) => {
    let random = Math.floor(Math.random() * allHandCards.length);
    while(myHandCards.includes( allHandCards[random] )){
      random = Math.floor(Math.random() * allHandCards.length);
    }
    return allHandCards[random];
  }, []);
  

  /* Fonction qui retourne la carte qui a la valeur "value"
  *
  * param : allHandCards : toutes les cartes main de notre base de données
  *         value : valeur de la carte recherché
  */
  const getHandCard = useCallback((value, allHandCards) =>{
    let i = 0;
    while(allHandCards[i].id !== value){
      i++
    }
    return allHandCards[i];
  }, [])


  // Envoie un mot qui n'as pas déjà été selectionner
  const getRandomWord = useCallback((allWords) => {
    let random = Math.floor(Math.random() * allWords.length);
    while(words.includes( allWords[random] )){
      random = Math.floor(Math.random() * allWords.length);
    }
    return allWords[random];
  }, [words])


  /* Procédure qui permet de remplir la variable de state : words
  * Qui contiendra une liste de mot qui correspondront pour chaque partie
  *         le mot attendu à la ième partie

  * param : allWords : tout les mots de notre base de données
  */
  const setRandomListWords = useCallback((allWords) => {
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ) {
      words.push( getRandomWord(allWords) );
    }
  }, [getRandomWord, words])


  /* Procédure qui permet de remplir la variable de state : handCards
  * Qui contiendra une liste de liste de "cartes main" qui correspondront pour chaque partie
  *         la main du joueur à la ième partie
  *
  *
  * param : allWords : tout les mots de notre base de données
  */
  const setRandomListHandCards = useCallback((allHandCards) => {
    //Une liste de toutes les mains de toutes les parties
    let handCardsList = [];
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ){

      //Liste des cartes main d'un seul round
      let roundCards = [];

      //Ajout des cartes qui sont les bonnes réponses
      words[i].cards.map((card, index) => {
        if(!card.isBoard){
          roundCards.push( getHandCard( card.value.id, allHandCards) )
        }
        return 0
      });

      //Rempli la main jusqu'à atteindre la taille de la main défini
      while(roundCards.length < HAND_SIZE){
        roundCards.push(getRandomCard(allHandCards, handCards));
      }

      //Mélange la main -> permet de ne pas avoir les bonnes cartes toujours au début
      shuffle(roundCards);

      //Affection d'une position à chaque carte
      roundCards.forEach( (card, index) =>(
        card.position = index
      ));

      handCardsList.push(roundCards);
    }

    setHandCards(handCardsList);

  }, [setHandCards, getHandCard, getRandomCard, words, handCards])


  // Fonction qui retourne un élément choisi au hasard dans la liste
  const pickRandomList = (list) => {
    return list[Math.floor(Math.random() * list.length)];
  }

  
  // Fonction de victoire d'une manche
  const appWin = () => {
    if (actualRound === GLOBAL_ROUND-1) {
      // Victoire
      
      setModalTitle(pickRandomList(winTitles));
      setModalEmoji(pickRandomList(winEmojis));
      setModalNextAction(newGame);
      setModalNextButtonText("Nouvelle partie");

    } else {
      // Mot juste

      setModalTitle(pickRandomList(wordSuccessTitles));
      setModalEmoji(pickRandomList(wordSuccessEmoji));
      setModalNextAction(nextRound);
      setModalNextButtonText("Passer au mot suivant");

    }

    setModalRestartAction(()=>{});

    setModalWrongWord("");
    setModalOpen(true);

  }


  // Fonction de défaite d'une manche
  const appFail = (playerWord) => {
    setModalTitle(pickRandomList(wordFailedTitles));
    setModalEmoji(pickRandomList(winFailedEmojis));
    setModalWrongWord(playerWord);

    setModalRestartAction(restartRound);
    setModalNextAction(nextRound);
    setModalNextButtonText("Passer au mot suivant");

    setModalOpen(true);
  }


  // Fonction de passage au round suivant
  const nextRound = () => {
    closeModal();
  }


  // Fonction qui recommence le round
  const restartRound = () => {
    closeModal();
  }

  
  // Fonction qui démarre redémarre une nouvelle partie
  const newGame = () => {
    closeModal();
  }


  // Fonction qui récupère les données depuis la base de donnée
  const getData = useCallback(async () => {
    let allHandCards = await Firebase.getHandCards();
      
      let wordsList = await Firebase.getWords();
  
      setRandomListWords(wordsList);
      setRandomListHandCards(allHandCards);
  }, [setRandomListHandCards, setRandomListWords])


  // Au lancement, le mot est dit une première fois
  useEffect(() => {
    if (!initialSpreech) {
      setInitialSpreech(true);
      getData();
    }
  }, [initialSpreech, getData])

  
  // Fonction de fermeture de la boite de dialogue
  let closeModal = () => setModalOpen(false);


  // Rendu
  if(handCards.length === 0 && words.length === 0 ){
    return (<Loading />);
  } else{
    return(
      <div className="w-full h-full overscroll-none overflow-hidden flex flex-col">

        <Modal open={modalOpen} onClose={modalNextAction} emoji={modalEmoji} title={modalTitle} word={words[actualRound].id} wrongWord={modalWrongWord} onRestart={modalRestartAction} nextButtonText={modalNextButtonText} />

        <GameBar />

        <GameContext handCards={handCards[actualRound]} word={words[actualRound]} onWin={appWin} onFail={appFail} />

      </div>
    );
  }

}


// Fonction qui mélange un tableau
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
