import './css/App.css';
import './css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { orderBy, range } from 'lodash';
import Hand, {updateCard, getCard} from './hand';
import CardPlacement, {updateCardPlacement} from './cardPlacement';
import CardStatic from './cardStatic'
import Board from './board';
import cardData from './initial-data.js'


//Les items du boards, card ou emplacement


export default class App extends React.Component{

    constructor(props){
      super(props);
      this.updatePlacement = this.updatePlacement.bind(this);

      //Tableau qui contiendra tout les élements du board
      this.boardItems = [ <CardStatic value='m'/> ,<CardPlacement  />,  <CardStatic value='g'/> ,<CardPlacement />]

      //Tableau qui contiendra toutes les réferences des éléments dans le tableau
      this.boardRefs = []
      this.boardItems.map( () => (
        this.boardRefs.push(React.createRef())
      ))
    }

    updateHand (newCard) {
      updateCard(newCard);
    }

    updatePlacement (newCard, dropId) {

    }

    onDragEnd = result => {
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


        const reOrderedHand = getCard().map(card => {


          //Quand on place pas dans le meme droppable
          if(destination.droppableId !== source.droppableId){


            if(destination.droppableId === 'hand'){
              //TO DO : Action de board à hand
            }

            //Quand on place dans le board -> recoint toutes les cartes sauf celle posé
            if(card.id !== parseInt(result.draggableId)){

              //Si la carte (card) est à droite de celle posé (result)
              if(card.position > result.source.index){
                card.position = card.position -1;
              }
              return card;
            }else{

              //Récupère la carte en question du changement
              let myCard = [card];

              //Appelle la fonction updateCardLocal de l'élement droppé dans boards
              this.boardRefs[ parseInt(destination.droppableId) ].current.updateCardLocal(myCard);
            }
          }


          //Carte posé dans la main
          if(destination.droppableId === source.droppableId){

            //Si card est le meme que celle bougé
            if(card.id === parseInt(result.draggableId)){
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

      //console.log(orderBy(filtered, "position"));
        this.updateHand(orderBy(filtered, "position"));
    } //Only required on ddcontext


                
    //<Board boardItems={boardItems} refs={this.boardRefs} />
    render(){
        return (
            <DragDropContext onDragEnd={this.onDragEnd} >
                <div className='board'>
                  {this.boardItems?.map( (item, index) => {
                    if(item.type === CardPlacement){
                      return <CardPlacement id={" " + index} key={index} index={index} ref={this.boardRefs[index]}  />;

                    } else{
                      return <CardStatic id={" " + index} key={index} index={index} ref={this.boardRefs[index]}  value={item.props.value}  />;
                    }

                  })}
                </div>
                <Hand />
            </DragDropContext>
        )
    }


}


ReactDOM.render(<App />, document.getElementById('root') )
