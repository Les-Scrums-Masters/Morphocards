import React from 'react';
import Card from './card';
import { orderBy } from 'lodash';
import { Droppable } from 'react-beautiful-dnd';

export default class Hand extends React.Component{


    constructor(props){
      super(props);
      this.state = this.props.cards ?? null;

      this.handUpdateCards = this.handUpdateCards.bind(this);
    }

     handUpdateCards(newCards){
      //Ne veut pas fonctionner avec setState - a voir
      //this.setState(newCards)
      this.state = newCards;
    }

     getCards = () =>{
      return Object.values(this.state);
      //return this.props.cards;
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
