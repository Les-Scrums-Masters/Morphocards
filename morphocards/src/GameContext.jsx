import './css/index.css';

import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { orderBy, range } from 'lodash';
import Hand from './components/hand';
import CardPlacement from './components/cardPlacement';
import CardStatic from './components/cardStatic'
import { useSpeechSynthesis } from 'react-speech-kit';
import { VolumeUpIcon } from '@heroicons/react/outline'



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
    const { speak, voices } = useSpeechSynthesis({onEnd: () => console.log("Word said")});
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


    // Fonction changement des cartes de main
    let updateHand = (newHand) => {

      // Suppression des emplacements sans cartes
      var filtered = newHand.filter(function(x) {
        return x !== undefined;
      });

      //Envoie la nouvelle liste de carte à la main, dans l'odre
      hand.current.handUpdateCards(orderBy(filtered, "position"));

    }


    // Fonction de vérification de victoire
    let checkWin = () => {
      
      // Il faut un timeOut car il faut laisser le temps au state des placements de se mettre à jour avant de vérifier la victoire
      setTimeout (() => {
        // On vérifie si tous les emplacements sont remplis :
        let nbEmpty = 0;

        // Récupère le nombre de placement vide et le ref du dernier
        boardRefs.forEach((ref) => {
          if(ref.current.getValue() === ""){
            nbEmpty++;
          }
        });

        // Si le mot est terminé :
        if (nbEmpty === 0) {

          // On récupère le mot sur le plateau
          let playerWord = getWord(/*draggableId*/);

          if( playerWord === word.id){

            //TODO : Gagner
            alert("you won " + playerWord);

          }else{

            //TODO : Perdu
            alert("you lose, it was " + word.id + " and you choose " + playerWord );

          }

          return true;
        }

        return false;
      }, 100)

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
        if(destination.droppableId === source.droppableId && destination.index === source.index){
          return;
        }


        /* ******************************* */
        // Si il met une carte de la main à un placement plateau si qu'il y a déjà une carte dans l'emplacement en question
        if( destination.droppableId !== 'hand' 
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

            // Vérification de la victoire 
            checkWin();

            return;

        }


        /* ******************************* */
        // Si l'action se fait entre 2 placements
        if(destination.droppableId !== 'hand' && source.droppableId !== 'hand') {

          // On récupère la carte qui était là avant
          let destinationCard = boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement();

          // On récupère la carte qu'on veut déplacer
          let sourceCard = boardRefs[ parseInt(source.droppableId) ].current.getCardPlacement();

          // Mise à jour de la case de destination
          boardRefs[ parseInt(destination.droppableId) ].current.updateCardLocal(sourceCard);

          // Mise à jour de la case spurce
          boardRefs[ parseInt(source.droppableId) ].current.updateCardLocal(destinationCard);

          // Vérification de la victoire
          checkWin();

          return;
        }


        /* ******************************* */
        // Si on repose une carte qui était sur le plateau
        if(destination.droppableId === 'hand' 
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

          return;

        }
        

        /* ******************************* */
        // Si le changement se fait uniquement dans la main
        if (destination.droppableId === source.droppableId 
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

          return;

        }
        

        /* ******************************* */
        // DERNIER CAS : Main --> Plateau
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

        // Vérification de la victoire
        checkWin();

    }


      return (
          <DragDropContext onDragEnd={onDragEnd} >
            <div className="flex flex-col-reverse items-center justify-center py-10 md:flex-row">
              <button onClick={sayWord} className="hearBtn md:mr-10"><VolumeUpIcon className="h-10 w-10"/></button>
              <div className='py-10 flex justify-center items-center'>
                {word.cards?.map( (card, index) => {

                  if(!card.isBoard){
                    return <CardPlacement id={" " + index} key={index} index={index} ref={boardRefs[index]}  />;

                  } else{
                    return <CardStatic id={" " + index} key={index} index={index} ref={boardRefs[index]}  value={card.value}  />;
                  }

                })}
              </div>
              </div>
              <Hand ref={hand} cards={props.handCards} />
          </DragDropContext>
      );

}