import React, {useState, useEffect, useCallback} from 'react';
import GameContext from './GameContext'
import Firebase from './Firebase'
import Modal from './components/Modal'
import RoundData from './models/RoundData'
import { useSpeechSynthesis } from 'react-speech-kit';

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

  // ------- TTS -------
  // Initialisation du text to spreech
  const { speak, voices, supported, cancel } = useSpeechSynthesis();
  // Variable qui vérifie si la voix préférée à déjà été initialisée
  const [voiceInitialized, setVoiceInitialized] = useState(false);
  // Voix préférée :
  const [preferredVoice, setPreferredVoice] = useState({});


  // ------- Boite de dialogue d'echec/succès -------
  const [modalEmoji, setModalEmoji] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalWrongWord, setModalWrongWord] = useState("");
  const [modalNextButtonText, setModalNextButtonText] = useState("");
  const [modalRestartAction, setModalRestartAction] = useState(true);
  const [modalNextAction, setModalNextAction] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);


  // ------- Données du jeu -------
  const [intialDataLoaded, setintialDataLoaded] = useState(false);
  const [initializedRounds, setInitializedRounds] = useState(false);

  // Créations des variables d'états contenant les toutes données du jeu !
  const [allHandCards, setAllHandCards] = useState([]);
  const [allWords, setAllWords] = useState([]);

  // Nombre de round dans une partie :
  const GLOBAL_ROUND = 3;

  // Nombre de carte dans une main :
  const HAND_SIZE = 6;


  // ------- Données des rounds -------
  
  // N° du round actuel :
  const [actualRound, setActualRound] = useState(0);

  // Données des rounds
  const [rounds, setRounds] = useState([]);



  // ------- Fonctions -------

  // Fonction qui prononce un mot
  const say = useCallback((text) => {
    if (preferredVoice) {
      cancel();
      speak({text: text, voice: preferredVoice});
    }
  }, [speak, preferredVoice, cancel])


  // Fonction de victoire d'une manche
  const appWin = () => {
    if (actualRound === GLOBAL_ROUND-1) {
      // Victoire

      setModalTitle(pickRandomList(winTitles));
      setModalEmoji(pickRandomList(winEmojis));
      setModalNextAction(false);
      setModalNextButtonText("Nouvelle partie");

    } else {
      // Mot juste

      setModalTitle(pickRandomList(wordSuccessTitles));
      setModalEmoji(pickRandomList(wordSuccessEmoji));
      setModalNextAction(true);
      setModalNextButtonText("Passer au mot suivant");

    }

    setModalRestartAction(false);

    setModalWrongWord("");
    setModalOpen(true);

  }


  // Fonction de défaite d'une manche
  const appFail = (playerWord) => {
    setModalTitle(pickRandomList(wordFailedTitles));
    setModalEmoji(pickRandomList(winFailedEmojis));
    setModalWrongWord(playerWord);

    setModalRestartAction(true);
    setModalNextAction(true);
    setModalNextButtonText("Passer au mot suivant");

    setModalOpen(true);
  }


  // Fonction de passage au round suivant
  const nextRound = () => {
    setActualRound(actualRound+1);
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






  
  /* Fonction qui retourne un élément de allValues qui n'est pas déjà dans usedValues
    *
    * param : allValues : toutes les éléments
    *         usedValues : les éléments déjà choisis
    */
  const getUniqueRandom = useCallback((allValues, usedValues) => {

    let random;
    do {
      random = Math.floor(Math.random() * allValues.length);
    } while(usedValues.includes(allValues[random]));

    return allValues[random];

  }, []);


  // Fonction qui retourne un élément choisi au hasard dans la liste
  const pickRandomList = (list) => {
    return list[Math.floor(Math.random() * list.length)];
  }

  /* Fonction qui retourne la carte qui a la valeur "value"
  *
  * param : value : valeur de la carte recherché
  */
  const getHandCard = useCallback((value) =>{

    return allHandCards.filter(item => item.prononciation === value)[0];

  }, [allHandCards]);


  // Fonction qui crée les rounds
  const makeRounds = useCallback(() => {

    // Création de la liste qui contiendra tous les rounds
    let roundsList = [];

    // Création d'une liste contenant tous les mots séléectionnés de chaque rounds
    let roundWordsList = [];

    // Pour chaque round
    for(let i = 0 ; i< GLOBAL_ROUND; i++ ) {

      // Sélection du mot du round
      let roundWord = getUniqueRandom(allWords, roundWordsList);
      roundWordsList.push(roundWord);

      // Listes des cartes de la main du round :
      let roundCards = [];

      // Ajout des cartes correctes :
      roundWord.cards.forEach((element) => {
        if(!element.isBoard) {
          roundCards.push(getHandCard(element.value.id));
        }
      });

      // Puis remplissage de la main avec d'autres cartes aléatoire :
      while(roundCards.length < HAND_SIZE) {
        roundCards.push(getUniqueRandom(allHandCards, roundCards));
      }

      // On mélange les cartes :
      shuffle(roundCards);

      // Et on leur affecte leur position :
      roundCards.forEach((element, index) => element.position = index);

      // Ajout du round formé à la liste
      roundsList.push(new RoundData(roundWord, roundCards));

    }

    // Définition des rounds du jeu :
    setRounds(roundsList);

  }, [getUniqueRandom, allHandCards, allWords, getHandCard]);


  // Fonction qui récupère les données depuis la base de donnée
  const getData = useCallback(async () => {

    setAllHandCards(await Firebase.getHandCards());
    setAllWords(await Firebase.getWords());

  }, [setAllHandCards, setAllWords])







  // Au au lancement
  useEffect(() => {

    // SI ELLES NE SONT PAS DEJE CHARGES, CHARGEMENT DES DONNES
    if (!intialDataLoaded) {
      setintialDataLoaded(true);
      // Obtention des données depuis la base :
      getData();
    }

    // SI ILS NE SONT PAS DEJA CREES, CREER LES ROUNDS
    if (!initializedRounds) {
      if (allHandCards.length > 0 && allWords.length > 0) {
        // Mots et cartes chargés, on peut créer les rounds
        setInitializedRounds(true);
        makeRounds();
      }
    }

    // SI ELLE N'EST PAS DEJA INITIALISE, INITIALISER LES VOIX
    if (!voiceInitialized) {

      if (voices.length > 0) {
        setVoiceInitialized(true);

        let defaultVoice = voices[0];

        // Filter les voix FR
        let frVoices = voices.filter((voice) => voice["lang"] === 'fr-FR');

        if (frVoices.length !== 0) {
          // Si il existe des voix française, on s'arrure que ce soit l'une d'elles qui soit sélectionné
          defaultVoice = frVoices[0];
        }

        // // Filter afin d'obtenir Denise 
        // let prefVoices = voices.filter((voice) => voice["voiceURI"] === 'Microsoft Denise Online (Natural) - French (France)');

        // if (prefVoices.length !== 0) {
        //   // Si denise existe, on l'utilise
        //   defaultVoice = prefVoices[0];
        // }

        setPreferredVoice(defaultVoice);

      }
    }

  }, [intialDataLoaded, getData, voiceInitialized, voices, supported, makeRounds, allHandCards.length, allWords.length, initializedRounds])


  // Fonction de fermeture de la boite de dialogue
  let closeModal = () => setModalOpen(false);


  // Rendu
  if(!initializedRounds || !intialDataLoaded || !preferredVoice){
    return (<Loading />);
  } else{
    return(
      <div className="w-full h-full overscroll-none overflow-hidden flex flex-col">

        <Modal open={modalOpen} onClose={modalNextAction ? nextRound : newGame} emoji={modalEmoji} title={modalTitle} word={rounds[actualRound].word.id} wrongWord={modalWrongWord} onRestart={modalRestartAction ? restartRound : undefined} nextButtonText={modalNextButtonText} say={say}/>

        <GameBar />

        <GameContext round={rounds[actualRound]} onWin={appWin} onFail={appFail} say={say}/>

      </div>
    );
  }

}


// Fonction qui mélange un tableau
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
