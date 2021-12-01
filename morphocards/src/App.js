import './css/index.css';

import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { orderBy, range } from 'lodash';
import Hand from './components/hand';
import CardPlacement from './components/cardPlacement';
import CardStatic from './components/cardStatic'


//Les items du boards, card ou emplacement
export default class App extends React.Component{


    constructor(props){
      super(props);

      this.state = {
        word:this.props.word
      };

      this.hand = React.createRef();

      //Tableau qui contiendra toutes les réferences des éléments dans le tableau
      this.boardRefs = []
      this.props.word.cards.map( () => (
        this.boardRefs.push(React.createRef())
      ));

      this.onDragEnd = this.onDragEnd.bind(this);
      this.updateHand = this.updateHand.bind(this);
      this.getWord = this.getWord.bind(this);
      this.checkWin = this.checkWin.bind(this);

    }

    // Fonction d'obtention du mot formé par le plateau
    getWord() {
      let word = "";
      this.boardRefs.forEach((ref) =>{
        word += ref.current.getValue();
      });
      return word;
    }


    // Fonction changement des cartes de main
    updateHand(newHand) {

      // Suppression des emplacements sans cartes
      var filtered = newHand.filter(function(x) {
        return x !== undefined;
      });

      //Envoie la nouvelle liste de carte à la main, dans l'odre
      this.hand.current.handUpdateCards(orderBy(filtered, "position"));

    }


    // Fonction de vérification de victoire
    checkWin() {
      
      // Il faut un timeOut car il faut laisser le temps au state des placements de se mettre à jour avant de vérifier la victoire
      setTimeout (() => {
        // On vérifie si tous les emplacements sont remplis :
        let nbEmpty = 0;

        // Récupère le nombre de placement vide et le ref du dernier
        this.boardRefs.forEach((ref) => {
          if(ref.current.getValue() === ""){
            nbEmpty++;
          }
        });

        // Si le mot est terminé :
        if (nbEmpty === 0) {

          // On récupère le mot sur le plateau
          let playerWord = this.getWord(/*draggableId*/);

          if( playerWord === this.state.word.id){

            //TODO : Gagner
            alert("you won " + playerWord);

          }else{

            //TODO : Perdu
            alert("you lose, it was " + this.state.word.id + " and you choose " + playerWord );

          }

          return true;
        }

        return false;
      }, 100)

    }


    //Fonction appelé lorsque le joueur va poser une carte
    onDragEnd(result) {

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
          && this.boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement() !== null) {

            // Obtenir l'emplacement cible
            let emplacement = this.boardRefs[ parseInt(destination.droppableId) ].current;

            // Prend la carte qui était anciennement dans le placement
            let oldCard = emplacement.getCardPlacement();

            // Création de la nouvelle main
            let newHand = this.hand.current.getCards().map((cardItem) => {
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

            // On place la carte anciennement sur le palcement à la fin de la main
            // card.position = this.hand.current.getCards().length;
            // newHand.push(card);

            // Mise à jour de la main
            this.updateHand(newHand);

            // Vérification de la victoire 
            this.checkWin();

            return;

        }


        /* ******************************* */
        // Si l'action se fait entre 2 placements
        if(destination.droppableId !== 'hand' && source.droppableId !== 'hand') {

          // On récupère la carte qui était là avant
          let destinationCard = this.boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement();

          // On récupère la carte qu'on veut déplacer
          let sourceCard = this.boardRefs[ parseInt(source.droppableId) ].current.getCardPlacement();

          // Mise à jour de la case de destination
          this.boardRefs[ parseInt(destination.droppableId) ].current.updateCardLocal(sourceCard);

          // Mise à jour de la case spurce
          this.boardRefs[ parseInt(source.droppableId) ].current.updateCardLocal(destinationCard);

          // Vérification de la victoire
          this.checkWin();

          return;
        }


        /* ******************************* */
        // Si on repose une carte qui était sur le plateau
        if(destination.droppableId === 'hand' 
        && destination.droppableId !== source.droppableId) {

          // Récupère le cardPlacement source (composant dans boardRefs)
          let emplacement = this.boardRefs[ parseInt(source.droppableId) ].current;

          // Récupère la carte en question
          let card = emplacement.getCardPlacement();

          // Enleve la carte dans l'emplacement source
          emplacement.updateCardLocal(null);

          // On la met à la position souhaitée
          card.position = destination.index;

          // Déplacement de toutes les cartes étant après la carte posée 
          let newHand = this.hand.current.getCards().map(cardItem => {
            if(cardItem.position >= destination.index){
              cardItem.position++;
            }
            return cardItem;
          });

          // Ajout de la nouvelle carte
          newHand.push(card);

          // Mise à jour de la main
          this.updateHand(newHand);

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

          let newHand = this.hand.current.getCards().map(card => {

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
          
          this.updateHand(newHand);

          return;

        }
        

        /* ******************************* */
        // DERNIER CAS : Main --> Plateau
        let newHand = this.hand.current.getCards().map(card => {

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
          this.boardRefs[ parseInt(destination.droppableId) ].current.updateCardLocal(card);

          return undefined;

        });

        // Mise à jour de la main
        this.updateHand(newHand);

        // Vérification de la victoire
        this.checkWin();

    }


    render(){
      return (
          <DragDropContext onDragEnd={this.onDragEnd} >
              <div className='h-80 flex justify-center items-center'>
                {this.state.word.cards?.map( (card, index) => {

                  if(!card.isBoard){
                    return <CardPlacement id={" " + index} key={index} index={index} ref={this.boardRefs[index]}  />;

                  } else{
                    return <CardStatic id={" " + index} key={index} index={index} ref={this.boardRefs[index]}  value={card.value}  />;
                  }

                })}
              </div>
              <Hand ref={this.hand} cards={this.props.handCards} />
          </DragDropContext>
      );
    }


}

    // //Retourne le mot sur le plateau de jeu
    // function getWord(draggableId) {
    //   let word = "";
    //   this.boardRefs.map( (ref) =>{
    //     word = word + ref.current.getValue();
    //   });
    //   return word;
    // }

    // //Renvoie true si le plateau est completement rempli
    // function wordFinished() {
    //   let nbEmpty = 0;

    //   //Récupère le nombre de placement vide et le ref du dernier
    //   this.boardRefs.map( (ref) =>{
    //     if(ref.current.getValue() === ""){
    //       nbEmpty++;
    //     }
    //   });

    //   if (nbEmpty === 0){
    //     return true
    //   }
    //   return false;
    // }
