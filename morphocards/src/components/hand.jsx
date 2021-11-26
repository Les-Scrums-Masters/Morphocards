import React, {useState} from 'react';
import Card from './card';
import { orderBy } from 'lodash';
import { Droppable } from 'react-beautiful-dnd';
import cardsData from '../initial-data';

export default class Hand extends React.Component{


    constructor(props){
      super(props);
      this.state = cardsData ?? null;

      updateCard = updateCard.bind(this);
      getCard = getCard.bind(this);
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

export function updateCard(newCard){
  this.state = newCard;
}

export function getCard(){
  return this.state;
}
