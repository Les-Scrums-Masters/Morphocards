import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Card from './Card';
import { Droppable } from 'react-beautiful-dnd';

const Hand = forwardRef((props, ref) => {

    const [cards, setCards] = useState(props.cards ?? null);

    useImperativeHandle(ref, () => ({
        updateCards(newCards) {
            
            // Mise à jour des cartes
            setCards(newCards);

        },

        getCards() {
            return cards;
        }

    }));

    return (
        <Droppable droppableId={props.id} direction="horizontal">
            {provided =>(
                <div className="flex h-24 md:h-40 justify-center items-center -mb-7"
                ref={provided.innerRef}
                {...provided.droppableProps}>
                    {cards.map((item, index) => ( 
                    
                            <Card index={index} key={item.uniqueId} card={item} say={props.say}/> 
                            
                    ))}
                    {provided.placeholder}

                </div>
            )}
        </Droppable>
    )

})


export default Hand;
