import React, {useState} from 'react';
import Card from './card';
import { orderBy } from 'lodash';
import { Droppable } from 'react-beautiful-dnd';

export default class CardPlacement extends React.Component{

  constructor(props){
    super(props);
    this.state = null;

    updateCardPlacement = updateCardPlacement.bind(this);
    //getCard = getCard.bind(this);
  }

  updateCardLocal = (newCard) =>{
    this.state = newCard;
  }

  getCardPlacement = () =>{
    if(this.state !== null){

      return this.state[0];
    }
    return null;
  }

    render (){
        return (
            <Droppable droppableId={this.props.id}
            >
                {provided =>(
                    <div className="cardPlacement"
                    ref={provided.innerRef}
                    {...provided.droppableProps}>

                    { this.state?.map((card, index)=> ( <Card index={index} key={card.id}  id={""+card.id} value={card.value} /> )) }


                        {provided.placeholder}
                    </div>

                )}
            </Droppable>

        )
    }
}

export function updateCardPlacement(newCard, index){
  this.state = newCard;
}
