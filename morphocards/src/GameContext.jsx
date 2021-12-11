import './css/index.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { orderBy, range } from 'lodash';
import Hand from './components/Hand';
import { CheckIcon, MicrophoneIcon, VolumeUpIcon } from '@heroicons/react/outline'
import GameBoard from './components/GameBoard';
import RoundButton from './components/RoundButton';


//Les items du boards, card ou emplacement
export default function GameContext(props) {

  // Références à la main et au plateau
  let handRef = useRef();
  const boardRef = useRef();

  // Mot prononcé initialement
  const [initialSpreech, setInitialSpreech] = useState(false);

  /* ------------------------ */


  // Fonction qui dicte le mot à reconstituer
  const sayWord = useCallback(() => {
    props.say(props.round.word.id);
  }, [props])


  // Fonction qui dicte le mot formé
  let sayUserWord = () => {
    props.say(boardRef.current.getWord());
  }


  // Au lancement, le mot est dit une première fois
  useEffect(() => {
    if (!initialSpreech) {
      setInitialSpreech(true);
      sayWord();
    }
  }, [initialSpreech, sayWord]);


  // Fonction changement des cartes de main
  const updateHand = (newHand) => {

    // Suppression des emplacements sans cartes
    var filtered = newHand.filter(function(x) {
      return x !== undefined;
    });

    //Envoie la nouvelle liste de carte à la main, dans l'odre
    handRef.current.handUpdateCards(orderBy(filtered, "position"));

  }


  // Fonction de vérification de victoire
  const checkWin = () => {

    // Si le mot est terminé (si toutes les cases ont été rempli) :
    if (boardRef.current.getEmptyCount() === 0) {
      if (boardRef.current.checkWin()) {
        // Gagné
        props.onWin();
      }else{
        // Perdu
        let playerWord = boardRef.current.getWord();
        props.onFail(playerWord);
      }
    }

  }


  // Fonction qui gère le cas de déplacement d'une carte de la main vers un emplacement plateau contenant déjà une carte
  const handleHandToBoardReplaceCard = (destination, draggableId) => {
    // Obtenir l'emplacement cible
    let emplacement = boardRef.current.getEmplacement(destination.droppableId);

    // Prend la carte qui était anciennement dans le placement
    let oldCard = emplacement.getCard();

    // Création de la nouvelle main
    let newHand = handRef.current.getCards().map((cardItem) => {
      if (cardItem.position === draggableId) {

        // Recopie de la position de la nouvelle carte dans celle à remettre dans la main
        oldCard.position = cardItem.position;

        // On met cette nouvelle carte dans la main
        emplacement.updateCardLocal(cardItem);

        // Et on met l'ancienne carte dans la main à la place
        return oldCard;
      }

      // Si pas de modif, on retourne la carte tel quel :
      return cardItem;
    });

    // Mise à jour de la main
    updateHand(newHand);
  }

    // Fonction qui gère un déplacement de la main au plateau
  const handleHandToBoard = (source, destination, draggableId) => {

    let newHand = handRef.current.getCards().map(card => {


      // On remet toutes les cartes sauf celle posé sur le plateau
      if (card.position !== parseInt(draggableId)) {

        // Si la carte (card) est à droite de celle posé (result)
        if(card.position > source.index) {

          // On la décale d'un cran
          card.position = card.position -1;

        }

        return card;

      }

      // Si c'est la carte selectionnée, ajout de celle ci dans l'emplacement demandé
      boardRef.current.getEmplacement(destination.droppableId).updateCardLocal(card);

      return undefined;

    });

    // Mise à jour de la main
    updateHand(newHand);

  }


  // Fonction qui gère l'échange de cartes de deux emplacements plateaux
  const handleSwitchPlacements = (source, destination, draggableId) => {
    // On récupère la carte qui était là avant
    let destinationCard = boardRef.current.getEmplacement(destination.droppableId).getCard();

    // On récupère la carte qu'on veut déplacer
    let sourceCard = boardRef.current.getEmplacement(source.droppableId).getCard();

    // Mise à jour de la case de destination
    boardRef.current.getEmplacement(destination.droppableId).updateCardLocal(sourceCard);

    // Mise à jour de la case spurce
    boardRef.current.getEmplacement(source.droppableId).updateCardLocal(destinationCard);
  }


  // Fonction qui gère la reprise dans la main d'une carte plateau
  const handleBoardToHand = (source, destination) => {
    // Récupère le cardPlacement source (composant dans boardRefs)
    let emplacement = boardRef.current.getEmplacement(source.droppableId);

    // Récupère la carte en question
    let card = emplacement.getCard();

    // Enleve la carte dans l'emplacement source
    emplacement.updateCardLocal(null);

    // On la met à la position souhaitée
    card.position = destination.index;

    // Déplacement de toutes les cartes étant après la carte posée
    let newHand = handRef.current.getCards().map(cardItem => {
      if(cardItem.position >= destination.index){
        cardItem.position++;
      }
      return cardItem;
    });

    // Ajout de la nouvelle carte
    newHand.push(card);

    // Mise à jour de la main
    updateHand(newHand);
  }


  // Fonction qui gère le déplacement d'une carte au sein de la main
  const handleHandMove = (source, destination, draggableId) => {
    let direction = destination.index > source.index ? "RIGHT" : "LEFT";

      // Obtiens un tableau de nouveaux indexes réeordonnés dû au changement de position des cartes
      let affectedRange = (direction === "RIGHT")
      ? range(source.index, destination.index +1 )
      : range(destination.index, source.index);

      let newHand = handRef.current.getCards().map(card => {
        //Si card est le meme que celle bougé
        if(card.position === parseInt(draggableId)){
          card.position = destination.index;
          return card;
        }

        //Si card est entre la position initiale et finale
        if(affectedRange.includes(card.position)){

          card.position = (direction === "RIGHT")
            ? card.position - 1
            : card.position + 1;

          return card;

        }

        //SINON
        return card;

      });

      updateHand(newHand);
  }


  // Fonction appelé lorsque le joueur va poser une carte
  const onDragEnd = (result) => {

    const {destination, source, draggableId} = result;

    /* ******************************* */
    //Si il le place dans un non droppable (donc pas de destination)
    if(!destination){
      return;
    }


    /* ******************************* */
    //Si il le place dans le meme droppable ET au meme endroit
    else if(destination.droppableId === source.droppableId && destination.index === source.index){
      return;
    }


    /* ******************************* */
    // Si il met une carte de la main à un placement plateau si qu'il y a déjà une carte dans l'emplacement en question
    else if( destination.droppableId !== 'hand'
      && source.droppableId === 'hand'
      && destination.droppableId !== source.droppableId
      && boardRef.current.getEmplacement(destination.droppableId).getCard() !== null) {

      handleHandToBoardReplaceCard(destination, parseInt(draggableId));

    }


    /* ******************************* */
    // Si l'action se fait entre 2 placements
    else if(destination.droppableId !== 'hand' && source.droppableId !== 'hand') {

      handleSwitchPlacements(source, destination, parseInt(draggableId));

    }


    /* ******************************* */
    // Si on repose une carte qui était sur le plateau
    else if(destination.droppableId === 'hand'
    && destination.droppableId !== source.droppableId) {

      handleBoardToHand(source, destination);

    }


    /* ******************************* */
    // Si le changement se fait uniquement dans la main
    else if (destination.droppableId === source.droppableId
      && destination.droppableId === 'hand') {

      handleHandMove(source, destination, parseInt(draggableId));

      // On ne veux pas que le mot soit redit après un changement dans la main
      return;

    }


    /* ******************************* */
    // DERNIER CAS : Main --> Plateau
    else {

      handleHandToBoard(source, destination, parseInt(draggableId));

    }


    // Dans tous les cas, si toutes les cases sont remplies, on dicte le mot automatiqueemnt après un petit délai pour laisser le changement se faire
    setTimeout(() => {
      if (boardRef.current.getEmptyCount() === 0) {
        sayUserWord();
      }
    }, 100);

  }


  // Rendu
  return (
    <DragDropContext onDragEnd={onDragEnd} >

      <div className="flex flex-col items-center justify-center gap-6 flex-grow flex-wrap">

        {/* PLATEAU */}
        <GameBoard ref={boardRef} word={props.round.word} say={props.say}/>

        {/* BOUTONS */}
        <div className="flex flex-row gap-5">
          <RoundButton animated={true} onClick={sayWord} label="Écouter le mot à reconstituer">
            <VolumeUpIcon/>
          </RoundButton>
          <RoundButton onClick={sayUserWord} label="Écouter le mot actuellement formé">
            <MicrophoneIcon/>
          </RoundButton>
          <RoundButton onClick={checkWin} label="Valider mon mot">
            <CheckIcon className="text-green-500"/>
          </RoundButton>
        </div>

      </div>

      {/* MAIN */}
      <Hand ref={handRef} cards={props.round.handcards} say={props.say} />

    </DragDropContext>
  );

}
