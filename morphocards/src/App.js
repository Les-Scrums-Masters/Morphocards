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
      getWord = getWord.bind(this);
      wordFinished = wordFinished.bind(this);

    }

    //Fonction appelé lorsque le joueur va poser une carte
    onDragEnd(result) {
        const {destination, source, draggableId} = result;
        if(!destination){ //Si il le place dans un non droppable (donc pas de destination)
            return;
        }

        let direction;

        //Si il le place dans le meme droppable ET au meme endroit
        if(destination.droppableId === source.droppableId && destination.index === source.index){
            return;
        }
        //Si le changement se fait uniquement dans la main
        else if((destination.droppableId === source.droppableId) && destination.droppableId === 'hand'){
          direction = destination.index > source.index ? "RIGHT" : "LEFT";
        }

        // Obtiens un tableau de nouveau index réeordonner dû au changement de position des cartes
        let affectedRange;
        if(direction === "RIGHT"){
          affectedRange = range(source.index, destination.index +1 );
        } else if (direction === 'LEFT'){
          affectedRange = range(destination.index, source.index);
        }

        //Quand il met une carte de la main à un placement qui a déjà une carte
        if(destination.droppableId !== 'hand' && source.droppableId === 'hand' && destination.droppableId !== source.droppableId){
          if(this.boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement() !== null){
            let newHand = this.hand.current.getCards();

            //Prend la carte qui était anciennement dans le placement et ka place à la fin de la main
            let card = this.boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement();
            card.position = this.hand.current.getCards().length;
            newHand.push(card);

            //Envoie la nouvelle liste de carte à la main
            this.hand.current.handUpdateCards(orderBy(newHand, "position"));
          }
        }

        //Si l'action se fait entre 2 Placement
        if(destination.droppableId !== 'hand' && source.droppableId !== 'hand'){
          let destinationCard = this.boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement();
          let sourceCard = this.boardRefs[ parseInt(source.droppableId) ].current.getCardPlacement();
          this.boardRefs[ parseInt(destination.droppableId) ].current.updateCardLocal(sourceCard);
          this.boardRefs[ parseInt(source.droppableId) ].current.updateCardLocal(destinationCard);
        }

        //Action : une carte qui va de board -> hand
        if(destination.droppableId === 'hand' && destination.droppableId !== source.droppableId){

          //Récupère la carte en question du changement
          let card = this.boardRefs[ parseInt(source.droppableId) ].current.getCardPlacement();
          card.position = destination.index;

          //Enleve la carte dans le cardPlacement source (composant dans boardRefs)
          this.boardRefs[ parseInt(source.droppableId) ].current.updateCardLocal(null);

          let newHand = this.hand.current.getCards().map(card => {
            if(destination.index <= card.position){
              card.position = card.position+1;
            }
            return card;
          });
          newHand.push(card);
          this.hand.current.handUpdateCards(newHand);

        } else{

          const reOrderedHand = this.hand.current.getCards().map(card => {

            //Quand on ne place pas dans le meme droppable
            if(destination.droppableId !== source.droppableId){

              //Quand on place dans le board -> recoit toutes les cartes sauf celle posé
              if(card.id !== result.draggableId){

                //Si la carte (card) est à droite de celle posé (result)
                if(card.position > result.source.index){
                  card.position = card.position -1;
                }
                return card;
              }else{

                //Appelle la fonction updateCardLocal du placeement droppé dans boards
                //Ajout donc la carte dans l'emplacement demandé
                if(destination.droppableId !== 'hand'){
                  let emplacement = this.boardRefs[ parseInt(destination.droppableId) ];
                  emplacement.current.updateCardLocal(card);
                }

              }

            }

            //Carte posé dans la main
            if(destination.droppableId === source.droppableId && destination.droppableId === 'hand'){

              //Si card est le meme que celle bougé
              if(card.id === result.draggableId){
                card.position = destination.index;
                return card;
              }

              //Si card est entre la position initiale et finale
              else if(affectedRange.includes(card.position)){
                if(direction === "RIGHT"){
                  card.position = card.position - 1;
                } else if (direction === "LEFT"){
                  card.position = card.position + 1;
                }
                return card;
              }

              //SINON
              else{
                return card;
              }
            }
          });

          var filtered = reOrderedHand.filter(function(x) {
               return x !== undefined;
          });

          //Envoie la nouvelle liste de carte à la main
          this.hand.current.handUpdateCards(orderBy(filtered, "position"));
        }

        //Si tout les emplacements ont été rempli -> récupère le mot sur le plateau
        //Il faut un timeOut car il faut laisser le temps au state des placements de se mettre à jour
        setTimeout (function(){
          if(wordFinished()){
            let playerWord = getWord(draggableId);
            if( playerWord === this.state.word.id){
              //TODO : Gagner
              alert("you won " + playerWord);
            }else{

              //TODO : Perdu
              alert("you lose, it was " + this.state.word.id + " and you choose " + playerWord );
            }
          }
        }.bind(this), 100)


    } //Only required on ddcontext



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

    //Retourne le mot sur le plateau de jeu
    function getWord(draggableId) {
      let word = "";
      this.boardRefs.map( (ref) =>{
        word = word + ref.current.getValue();
      });
      return word;
    }

    //Renvoie true si le plateau est completement rempli
    function wordFinished() {
      let nbEmpty = 0;

      //Récupère le nombre de placement vide et le ref du dernier
      this.boardRefs.map( (ref) =>{
        if(ref.current.getValue() === ""){
          nbEmpty++;
        }
      });

      if (nbEmpty === 0){
        return true
      }
      return false;
    }
