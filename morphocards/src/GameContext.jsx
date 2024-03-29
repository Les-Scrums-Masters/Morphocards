import './css/index.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import useSound from 'use-sound';
import { CheckIcon, MicrophoneIcon, VolumeUpIcon } from '@heroicons/react/outline'

import GameBoard from './components/GameBoard';
import Hand from './components/Hand';
import RoundButton from './components/RoundButton';
import Notification from './components/Notification';

import dragCardSong from './sounds/card_drag_in.ogg';
import dropCardSong from './sounds/card_drop_out.ogg';
import loopCardSong from './sounds/card_loop_magical.ogg';
import hoverCardSong from './sounds/small_mouseover.ogg';
import roundSuccessSound from './sounds/round_success.ogg';
import roundFailSound from './sounds/round_fail.ogg';

//Les items du boards, card ou emplacement
export default function GameContext(props) {


  // Références à la main et au plateau
  let handRef = useRef();
  const boardRef = useRef();

  // Droppable ID de la main de cette manche :
  let handID = props.round.word.id+"/hand";

  // Mot prononcé initialement
  const [initialSpreech, setInitialSpreech] = useState(false);

  // Notification
  const [openNotification, setOpenNotification] = useState(false);

  let closeNotification = () =>{
    setOpenNotification(false);
  }


  /*SON DE CARTE*/
  const [playDrag] = useSound(dragCardSong ,{
    playbackRate:0.8, //vitesse de lecture
    interrupt: false,
    volume:0.25,
  });
  const [playDrop] = useSound(dropCardSong,{
    playbackRate:0.8, //vitesse de lecture
    interrupt: false,
    volume:0.3,
  });

  const [playHover] = useSound(hoverCardSong,{
    playbackRate:0.8, //vitesse de lecture
    interrupt: false,
    volume:0.3,
  });

  const [playSuccess] = useSound(roundSuccessSound, {
    volume: 0.3,
    interrupt: false
  });

  const [playFail] = useSound(roundFailSound, {
    volume: 0.4,
    interrupt: false
  })

  const [ , {sound}] = useSound(loopCardSong, {});
  const dropLoopVolume = 0.020;

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


  // Fonction de vérification de victoire
  const checkWin = () => {

    setOpenNotification(false);

    // Si le mot est terminé (si toutes les cases ont été rempli) :
    if (boardRef.current.getEmptyCount() === 0) {
      if (boardRef.current.checkWin()) {
        // Gagné
        props.onWin();
        playSuccess();
      }else{
        // Perdu
        let playerWord = boardRef.current.getWord();
        props.onFail(playerWord);
        playFail();
      }
    } else{
      setOpenNotification(true);
    }

  }


  /* -------- GESTION DU DRAG N DROP --------- */


  // Fonction qui réordone une liste selon le déplacement demandé
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // Déplace un élément d'une liste à une autre
  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    // Si la destination est un emplacement plateau et qu'il contient déja une carte
    if (!isHand(droppableDestination.droppableId) && getList(droppableDestination.droppableId).length > 0) {

      // On y récupère la carte qui s'y trouve
      const card = destClone.pop();

      // Pour la placer à la source
      sourceClone.push(card);

    }

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };


  // Fonction qui récupère la liste de l'emplacement ID
  const getList = (id) => {
    if (id === handID) {
      return handRef.current.getCards();
    } else {
      return boardRef.current.getEmplacement(id).getCards();
    }
  }


  // Fonction qui défini la liste de l'emplacement ID à content
  const setList = (id, content) => {

    if (id === handID) {
      handRef.current.updateCards(content);
    } else {
      boardRef.current.getEmplacement(id).updateCards(content);
    }

  }


  // Fonction qui renvoie VRAI si l'id de l'emplacement demandé correspond à là main
  const isHand = (id) => id === handID;


  // Fonction appelé lorsque le joueur va poser une carte
  const onDragEnd = (result) => {

    //Arret du son Magique de carte en fade-out
    try {
      sound.fade(dropLoopVolume, 0, 400)
    } catch(e) {
      console.error(e);
    }

    const {destination, source} = result;

    /* ******************************* */
    // Si il le place dans un non droppable (donc pas de destination)
    if(!destination){
      return;
    }


    /* ******************************* */
    // Si il le place dans le meme droppable ET au meme endroit
    else if(destination.droppableId === source.droppableId && destination.index === source.index){
      return;
    }

    /* ******************************* */
    // Déplacement Main <-> Main
    if (source.droppableId === destination.droppableId
      && isHand(destination.droppableId)) {

      const items = reorder(
          getList(source.droppableId),
          source.index,
          destination.index
      );

      setList(handID,items);

    /* ******************************* */
    // Autre déplacement
    } else {
        const result = move(
            getList(source.droppableId),
            getList(destination.droppableId),
            source,
            destination
        );

        for (const [key, value] of Object.entries(result)) {
          setList(key, value);
        }
        playDrop();
    }


    // Dans tous les cas, si toutes les cases sont remplies, on dicte le mot automatiqueemnt après un petit délai pour laisser le changement se faire
    setTimeout(() => {
      if (boardRef.current.getEmptyCount() === 0) {
        sayUserWord();
      }
    }, 100);

  }

    // Fonction appelé lorsque le joueur va prendre une carte
    const onDragStart = (result) => {
      try {
        //Son de l'action prendre une carte
        playDrag();

        //Met la répétition du son
        //Met un fade-in
        //Joue le son magique lorsqu'on prend la carte et
        sound.loop(true);
        sound.fade(0, dropLoopVolume, 700)
        sound.play()
      } catch (e) {
        console.error(e);
      }
    };

    const onDragUpdate = (update) => {
      if(update.destination !== null){
        if( !isHand(update.destination.droppableId)){
          
          try {
            playHover();
          } catch (e) {
            console.error(e);
          }

        }
      }

  };


  // Rendu
  return (
    <DragDropContext
    onDragEnd={onDragEnd}
    onDragStart={onDragStart}
    onDragUpdate={onDragUpdate}
    >

      <div className="flex flex-col items-center justify-center gap-6 flex-grow flex-wrap">

        {/* PLATEAU */}
        <GameBoard ref={boardRef} word={props.round.word} say={props.say}/>

        {/* BOUTONS */}
        <div className="flex flex-row gap-5 md:gap-8">
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

      <Notification open={openNotification} closeNotification={closeNotification} />

      {/* MAIN */}

      <Hand ref={handRef} id={handID} cards={props.round.handcards} say={props.say} />

    </DragDropContext>
  );

}
