import './css/index.css';

import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { orderBy, range } from 'lodash';
import Hand from './components/hand';
import CardPlacement from './components/cardPlacement';
import CardStatic from './components/cardStatic'
import { useSpeechSynthesis } from 'react-speech-kit';
import { CheckIcon, MicrophoneIcon, VolumeUpIcon } from '@heroicons/react/outline'



//Les items du boards, card ou emplacement
export default function GameContext(props) {


    /* ---- "Constructeur" ----- */ 
    const [word] = useState(props.word);
    let hand = React.createRef();
    
    //Tableau qui contiendra toutes les réferences des éléments dans le tableau
    let boardRefs = []
    word.cards.map( () => (
      boardRefs.push(React.createRef())
    ));

    /* ------------------------ */

    //  TextToSpreech
    const { speak, voices } = useSpeechSynthesis();
    const [initialSpreech, setInitialSpreech] = useState(false);

    const sayWord = useCallback(() => {
      speak({text:" "});
      speak({text: word.id})
    }, [speak, word.id])

    // Au lancement, le mot est dit une première fois
    useEffect(() => {
      if (!initialSpreech && voices.length !== 0) {
        setInitialSpreech(true);
        sayWord();
      }
    }, [initialSpreech, voices.length, sayWord])


    // Fonction d'obtention du mot formé par le plateau
    let getWord = () => {
      let w = "";
      boardRefs.forEach((ref) =>{
        w += ref.current.getValue();
      });
      return w;
    }

    // Fonction qui dicte le mot formé
    let sayUserWord = () => {
      speak({text: getWord()});
    }

    // Fonction changement des cartes de main
    let updateHand = (newHand) => {

      // Suppression des emplacements sans cartes
      var filtered = newHand.filter(function(x) {
        return x !== undefined;
      });

      //Envoie la nouvelle liste de carte à la main, dans l'odre
      hand.current.handUpdateCards(orderBy(filtered, "position"));

    }

    let getEmptyCount = () => {
      // On vérifie si tous les emplacements sont remplis :
      let nbEmpty = 0;

      // Récupère le nombre de placement vide et le ref du dernier
      boardRefs.forEach((ref) => {
        if(ref.current.getValue() === ""){
          nbEmpty++;
        }
      });

      return nbEmpty;
    }


    // Fonction de vérification de victoire
    let checkWin = () => {
      
        // Si le mot est terminé :
        if (getEmptyCount() === 0) {
          // On récupère le mot sur le plateau
          let playerWord = getWord();

          if( playerWord === word.id){
            // Gagner
            props.onWin();
          }else{
            // Perdu
            props.onFail(playerWord);
          }
          return true;
        }

        return false;
    }


    //Fonction appelé lorsque le joueur va poser une carte
    let onDragEnd = (result) => {

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
          && boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement() !== null) {

            // Obtenir l'emplacement cible
            let emplacement = boardRefs[ parseInt(destination.droppableId) ].current;

            // Prend la carte qui était anciennement dans le placement
            let oldCard = emplacement.getCardPlacement();

            // Création de la nouvelle main
            let newHand = hand.current.getCards().map((cardItem) => {
              if (cardItem.id === draggableId) {

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


        /* ******************************* */
        // Si l'action se fait entre 2 placements
        else if(destination.droppableId !== 'hand' && source.droppableId !== 'hand') {

          // On récupère la carte qui était là avant
          let destinationCard = boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement();

          // On récupère la carte qu'on veut déplacer
          let sourceCard = boardRefs[ parseInt(source.droppableId) ].current.getCardPlacement();

          // Mise à jour de la case de destination
          boardRefs[ parseInt(destination.droppableId) ].current.updateCardLocal(sourceCard);

          // Mise à jour de la case spurce
          boardRefs[ parseInt(source.droppableId) ].current.updateCardLocal(destinationCard);

        }


        /* ******************************* */
        // Si on repose une carte qui était sur le plateau
        else if(destination.droppableId === 'hand' 
        && destination.droppableId !== source.droppableId) {

          // Récupère le cardPlacement source (composant dans boardRefs)
          let emplacement = boardRefs[ parseInt(source.droppableId) ].current;

          // Récupère la carte en question
          let card = emplacement.getCardPlacement();

          // Enleve la carte dans l'emplacement source
          emplacement.updateCardLocal(null);

          // On la met à la position souhaitée
          card.position = destination.index;

          // Déplacement de toutes les cartes étant après la carte posée 
          let newHand = hand.current.getCards().map(cardItem => {
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
        

        /* ******************************* */
        // Si le changement se fait uniquement dans la main
        else if (destination.droppableId === source.droppableId 
          && destination.droppableId === 'hand') {
          
          let direction = destination.index > source.index ? "RIGHT" : "LEFT";

          // Obtiens un tableau de nouveaux indexes réeordonnés dû au changement de position des cartes
          let affectedRange = (direction === "RIGHT") 
          ? range(source.index, destination.index +1 ) 
          : range(destination.index, source.index);

          let newHand = hand.current.getCards().map(card => {

            //Si card est le meme que celle bougé
            if(card.id === draggableId){
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

          // On ne veux pas que le mot soit redit après un changement dans la main
          return;

        }
        

        /* ******************************* */
        // DERNIER CAS : Main --> Plateau
        else {
          let newHand = hand.current.getCards().map(card => {

            // On remet toutes les cartes sauf celle posé sur le plateau
            if (card.id !== result.draggableId) {
  
              // Si la carte (card) est à droite de celle posé (result)
              if(card.position > result.source.index) {
                
                // On la décale d'un cran
                card.position = card.position -1;
  
              }
  
              return card;
  
            }
              
            // Si c'est la carte selectionnée, ajout de celle ci dans l'emplacement demandé
            boardRefs[ parseInt(destination.droppableId) ].current.updateCardLocal(card);
  
            return undefined;
  
          });
  
          // Mise à jour de la main
          updateHand(newHand);
        }


        // Dans tous les cas, si toutes les cases sont remplies, on dicte le mot automatiqueemnt après un petit délai pour laisser le changement se faire
        setTimeout(() => {
          if (getEmptyCount() === 0) {
            sayUserWord();
          } 
        }, 100);
        
    }


      return (
        <div className="w-full h-full flex flex-col overscroll-none overflow-hidden">

          {/* BARRE */}
          <div className="w-full bg-white bg-opacity-10 flex items-center justify-center py-5">
            <p className="text-white">Morphocards</p>
          </div>

          <DragDropContext onDragEnd={onDragEnd} >

            {/* PLATEAU */}
            <div className="flex flex-col items-center justify-center gap-6 flex-grow flex-wrap">

              <div className='flex justify-center items-center flex-wrap'>
                {word.cards?.map( (card, index) => {

                  if(!card.isBoard){
                    return <CardPlacement id={" " + index} key={index} index={index} ref={boardRefs[index]}  />;

                  } else{
                    return <CardStatic id={" " + index} key={index} index={index} ref={boardRefs[index]}  value={card.value}  />;
                  }

                })}
              </div>

              {/* BOUTONS */}
              <div className="flex flex-row gap-5">
                <div className="btnGroup">
                  <button id="sayInitialWord" onClick={sayWord} className="roundBtn"><VolumeUpIcon/></button>
                  <label htmlFor="sayInitialWord">Écouter le mot à reconstituer</label>
                </div>
                <div className="btnGroup">
                  <button id="sayUserWord" onClick={sayUserWord} className="roundBtn"><MicrophoneIcon/></button>
                  <label htmlFor="sayUserWord">Écouter le mot actuellement formé</label>
                </div>
                <div className="btnGroup">
                  <button id="validateRound" onClick={checkWin} className="roundBtn focus:ring-green-300"><CheckIcon className="text-green-500"/></button>
                  <label htmlFor="validateRound">Valider mon mot</label>
                </div>
              </div>

            </div>

            {/* MAIN */}
            <Hand ref={hand} cards={props.handCards} />

          </DragDropContext>
        </div>
      );

}