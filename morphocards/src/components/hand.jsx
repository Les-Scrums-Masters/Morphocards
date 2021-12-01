import '../css/index.css';

import React from 'react';
import Card from './card';
import { orderBy } from 'lodash';
import { Droppable } from 'react-beautiful-dnd';

export default class Hand extends React.Component{

    constructor(props){
        super(props);
        this.state = {cards: this.props.cards ?? null};

        this.handUpdateCards = this.handUpdateCards.bind(this);
    }

    handUpdateCards(newCards){

        // On s'assure que les positions sont correctes :
        newCards.forEach((item, index) => item.position = index);

        // Mise à jour des cartes
        this.setState({cards: newCards});

    }

     getCards = () =>{
      return Object.values(this.state.cards);
    }

    render (){
        return (
            <Droppable
            droppableId="hand"
            direction="horizontal"
            >
                {provided =>(
                    <div className="h-40 flex justify-center items-center min-w-full"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    >
                        { orderBy(this.state.cards, "position").map((card, index)=> ( <Card index={index} key={card.id}  id={""+card.id} value={card.value} /> )) }

                        {provided.placeholder}

                    </div>
                )}
            </Droppable>
        )
    }
}
