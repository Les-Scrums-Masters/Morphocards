import React, {useState} from 'react';
import Card from './card';
import { orderBy } from 'lodash';
import { Droppable } from 'react-beautiful-dnd';
import cardsData from '../initial-data';

export default class Hand extends React.Component{


    constructor(props){
      super(props);
      this.state = this.props.cards ?? null;

      handUpdateCards = handUpdateCards.bind(this);
      getCards = getCards.bind(this);
    }

    render (){
        return (
            <Droppable
            droppableId="hand"
            direction="horizontal"
            >
                {provided =>(
                    <div className="hand"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    >
                        { orderBy(this.state, "position").map((card, index)=> ( <Card index={index} key={card.id}  id={""+card.id} value={card.value} /> )) }

                        {provided.placeholder}

                    </div>
                )}
            </Droppable>
        )
    }
}


export function handUpdateCards(newCards){
  //Ne veut pas fonctionner avec setState - a voir
  //this.setState(newCards)
  this.state = newCards;
}


export function getCards(){
  return Object.values(this.state);
  //return this.props.cards;
}
