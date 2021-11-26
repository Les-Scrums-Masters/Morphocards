import './css/App.css';
import './css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { orderBy, range } from 'lodash';
import Hand, {handUpdateCards, getCards} from './components/hand';
import CardPlacement, {updateCardPlacement, getCardPlacement} from './components/cardPlacement';
import CardStatic from './components/cardStatic'
import Board from './components/board';
import cardData from './initial-data.js'


//Les items du boards, card ou emplacement


export default class App extends React.Component{

    constructor(props){
      super(props);
      this.updatePlacement = this.updatePlacement.bind(this);


      this.hand = React.createRef();

      //Tableau qui contiendra tout les élements du board
      this.boardItems = [ <CardStatic value='m'/> ,<CardPlacement  />,  <CardStatic value='g'/> ,<CardPlacement />]

      //Tableau qui contiendra toutes les réferences des éléments dans le tableau
      this.boardRefs = []
      this.boardItems.map( () => (
        this.boardRefs.push(React.createRef())
      ))
    }


    updatePlacement (newCard, dropId) {

    }

    onDragEnd = result => {
        console.log(getCards());
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



        if(destination.droppableId !== 'hand'){
          if(this.boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement() !== null){
            let newHand = getCards();
            let card = this.boardRefs[ parseInt(destination.droppableId) ].current.getCardPlacement();
            card.position = getCards().length;
            newHand.push(card);
          }
        }




        //Action : une carte qui va de board -> hand
        if(destination.droppableId === 'hand' && destination.droppableId !== source.droppableId){

          //Récupère la carte en question du changement
          let card = this.boardRefs[ parseInt(source.droppableId) ].current.getCardPlacement();

          card.position = destination.index;

          //Enleve la carte dans le cardPlacement source (composant dans boardRefs)
          this.boardRefs[ parseInt(source.droppableId) ].current.updateCardLocal(null);




          let newHand = getCards().map(card => {
            if(destination.index <= card.position){
              card.position = card.position+1;
            }
            return card;
          });
          newHand.push(card);
          handUpdateCards(newHand);


        } else{
          const reOrderedHand = getCards().map(card => {

            let emplacement = this.boardRefs[ parseInt(destination.droppableId) ];
            //Quand on ne place pas dans le meme droppable
            if(destination.droppableId !== source.droppableId){



              //Quand on place dans le board -> recoit toutes les cartes sauf celle posé
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
                //Ajout donc la carte dans l'emplacement demandé
                if(destination.droppableId !== 'hand'){
                  emplacement.current.updateCardLocal(myCard);
                }


              }



            }


            //Carte posé dans la main
            if(destination.droppableId === source.droppableId && destination.droppableId === 'hand'){

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

          //Envoie la nouvelle liste de carte à la main
          handUpdateCards(orderBy(filtered, "position"));
        }





        console.log(getCards());
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
                <Hand ref={this.hand} />
            </DragDropContext>
        )
    }


}


ReactDOM.render(<App />, document.getElementById('root') )
