import React, {useState, useEffect, useCallback} from 'react';
import GameContext from './GameContext'
import Firebase from './Firebase'
import Modal from './components/Modal'
import RoundData from './models/RoundData'
import { useSpeechSynthesis } from 'react-speech-kit';

import Loading from './components/Loading';
import GameBar from './components/GameBar';
import HandCardModel from './models/HandCardModel';
import ModalButton from './components/ModalButton';
import ModalWordDisplay from './components/ModalWordDisplay';


// Contenu de la boite de dialogue si le mot est trouvé :
const wordSuccessEmoji = [
  String.fromCodePoint(0x1F600),
  String.fromCodePoint(0x1F603),
  String.fromCodePoint(0x1F601),
  String.fromCodePoint(0x1F60A),
  String.fromCodePoint(0x1F970)
];
const wordSuccessTitles = [
  'Bien joué !', 
  'Trop fort !', 
  'Bravo !', 
  'C\'est ça !'
];


// Contenu de la boite de dialogue lorsque la partie est terminée :
const winEmojis = [
  String.fromCodePoint(0x1F60D),
  String.fromCodePoint(0x1F929),
  String.fromCodePoint(0x1F60B),
  String.fromCodePoint(0x1F920),
  String.fromCodePoint(0x1F973),
  String.fromCodePoint(0x1F60E)
];
const winTitles = [
  'Partie terminée !', 
  'Félicitations !', 
  'C\'etait une belle partie !', 
  'Belle performance !'
];


// Contenu de la boite de dialogue lorsque qu'un mot n'est pas trouvé
const winFailedEmojis = [
  String.fromCodePoint(0x1F612),
  String.fromCodePoint(0x1F644),
  String.fromCodePoint(0x1F62C),
  String.fromCodePoint(0x1F614),
  String.fromCodePoint(0x1F915),
  String.fromCodePoint(0x1F974),
  String.fromCodePoint(0x1F61F),
  String.fromCodePoint(0x1F641),
  String.fromCodePoint(0x1F615)
];
const wordFailedTitles = [
  'Dommage !', 
  'Retente ta chance !', 
  'va voir gossa', 
  'Mince', 
  'Misèricorde', 
  'oups', 
  'Ce n\'est pas ça !'
];


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

  const [modalContent, setModalContent] = useState(null);
  const [modalButtons, setModalButtons] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);


  // ------- Données du jeu -------
  const [intialDataLoaded, setintialDataLoaded] = useState(false);

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
  const [initializedRounds, setInitializedRounds] = useState(false);

  // ------- Fonctions -------

  // Fonction qui prononce un mot
  const say = useCallback((text) => {
    if (preferredVoice) {
      cancel();
      speak({text: text, voice: preferredVoice});
    }
  }, [speak, preferredVoice, cancel])


  // Fonction d'intitialisation des voix
  const initVoices = useCallback(() => {
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
  }, [voices]);


  // Fonction de fermeture de la boite de dialogue
  let closeModal = () => setModalOpen(false);


  // Fonction qui retourne le texte devant être affiché dans le bouton suivant
  const getNextButtonText = () => (actualRound===GLOBAL_ROUND-1) 
    ? "Terminer la partie" 
    : "Passer au mot suivant";


  // Fonction qui retourne le mot actuel
  let getActualWord = () => rounds[actualRound].word.id;


  // Fonction qui retourne le composant du round actuel
  let getRoundComponent = () => {
    let round = rounds[actualRound];
    return (
      <GameContext key={round.word.id} round={round} onWin={appWin} onFail={appFail} say={say}/>
    );
  }


  const gameFinished = () => {
    setModalTitle(pickRandomList(winTitles));
    setModalEmoji(pickRandomList(winEmojis));

    setModalContent((
      <p>Afficher les résultats de la partie ici</p>
    ));

    setModalButtons((
      <div className='py-3 grid gap-3'>
        <ModalButton onClick={() => {}} color="focus:ring-red-500 text-white hover:bg-red-700 bg-red-600">
          Retour au menu principal
        </ModalButton>
        <ModalButton onClick={() => {}} color="text-white hover:bg-indigo-700 bg-indigo-600 focus:ring-indigo-500">
          Commencer une nouvelle partie
        </ModalButton>
      </div>
    ));

    setModalOpen(true);
  }


  // Fonction de passage au round suivant
  const nextRound = () => {
    console.log(actualRound);
    if (actualRound<GLOBAL_ROUND-1) {
      closeModal();
      setActualRound(actualRound+1);
      console.log("Round suivant");
    } else {
      gameFinished()
      console.log("Partie terminée");
    }
  }


  // Fonction qui recommence le round
  const restartRound = () => {
    closeModal();
  }


  // Fonction de victoire d'une manche
  const appWin = () => {

    setModalTitle(pickRandomList(wordSuccessTitles));
    setModalEmoji(pickRandomList(wordSuccessEmoji));

    setModalContent((
      <ModalWordDisplay word={getActualWord()} legend="Le mot était" say={say} />
    ));

    setModalButtons((
      <ModalButton onClick={nextRound} color="text-white hover:bg-indigo-700 bg-indigo-600 focus:ring-indigo-500">
        {getNextButtonText()}
      </ModalButton>
    ));

    setModalOpen(true);

  };


  // Fonction de défaite d'une manche
  const appFail = (playerWord) => {
    setModalTitle(pickRandomList(wordFailedTitles));
    setModalEmoji(pickRandomList(winFailedEmojis));
    
    setModalContent(
      <div>
        <ModalWordDisplay word={getActualWord()} legend="Le mot était" say={say} />
        <ModalWordDisplay word={playerWord} legend="Vous avez constitué le mot" say={say} />
      </div>
    );

    setModalButtons((
      <div className='py-3 grid gap-3'>
        <ModalButton onClick={restartRound} color="focus:ring-red-500 text-white hover:bg-red-700 bg-red-600">
          Réessayer
        </ModalButton>
        <ModalButton onClick={nextRound} color="text-white hover:bg-indigo-700 bg-indigo-600 focus:ring-indigo-500">
          {getNextButtonText()}
        </ModalButton>
      </div>
    ));

    setModalOpen(true);
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

    return allHandCards.filter(item => item.id === value)[0];

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

      // Listes des cartes de la main sélectionnés pour ce round :
      let selectedCards = [];

      // Ajout des cartes correctes :
      roundWord.cards.forEach((element) => {
        if(!element.isBoard) {
          selectedCards.push(getHandCard(element.value.id));
        }
      });

      // Puis remplissage de la main avec d'autres cartes aléatoire :
      while(selectedCards.length < HAND_SIZE) {
        selectedCards.push(getUniqueRandom(allHandCards, selectedCards));
      }

      // On mélange les cartes :
      shuffle(selectedCards);

      // On crée la liste de cartes dupliqués spécifiques au round
      let roundCards = [];

      // On affecte leur affecte leur position et on crée un ID unique pour chaque carte du round :
      selectedCards.forEach((element, index) => {
        let newCard = new HandCardModel(element.id, element.value);
        newCard.position = index;
        newCard.uniqueId = roundWord.id+index;
        roundCards.push(newCard);
      });

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


  useEffect(() => {


    // SI ELLES NE SONT PAS DEJE CHARGES, CHARGEMENT DES DONNES
    if (!intialDataLoaded) {
      setintialDataLoaded(true);
      getData();
    }

    // SI ILS NE SONT PAS DEJA CREES, CREER LES ROUNDS
    if (!initializedRounds) {
      // Si les mots et les cartes sont chargés on peut créer les rounds
      if (allHandCards.length > 0 && allWords.length > 0) {
        setInitializedRounds(true);
        makeRounds();
      }
    }

    // SI ELLE N'EST PAS DEJA INITIALISE, INITIALISER LES VOIX
    if (!voiceInitialized) {
      // On attend que le navigateur ai chargé les voix pour en sélectionner
      if (voices.length > 0) {
        setVoiceInitialized(true);
        initVoices();
      }
    }

  }, [intialDataLoaded, getData, voiceInitialized, voices, supported, makeRounds, allHandCards.length, allWords.length, initializedRounds, rounds.length, initVoices])


  // ---------- RENDU --------
  
  if(rounds.length > 0 && preferredVoice && supported) {
    // Si les componsants sont chargés et qu'il y a des voix disponibles, afficher le jeu
    return(
      <div className="w-full h-full overscroll-none overflow-hidden flex flex-col">

        <Modal open={modalOpen} emoji={modalEmoji} title={modalTitle} buttons={modalButtons} onClose={closeModal}>
            {modalContent}
        </Modal>

        <GameBar />

        {getRoundComponent()}

      </div>
    );
    
  } else {
    // Sinon, afficher le chargement
    return (<Loading />);
  }

}


// Fonction qui mélange un tableau
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
