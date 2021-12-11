import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Card from './Card';
import { orderBy } from 'lodash';
import { Droppable } from 'react-beautiful-dnd';

const Hand = forwardRef((props, ref) => {

    const [cards, setCards] = useState(props.cards ?? null);

    useImperativeHandle(ref, () => ({
        handUpdateCards(newCards) {

            // On s'assure que les positions sont correctes :
            newCards.forEach((item, index) => item.position = index);

            // Mise à jour des cartes
            setCards(newCards);

        },

        getCards() {
            return Object.values(cards);
        }

    }));

    return (
        <Droppable droppableId="hand" direction="horizontal">
            {provided =>(
                <div className="flex h-24 md:h-40 justify-center items-center -mb-7"
                ref={provided.innerRef}
                {...provided.droppableProps}>
                    { orderBy(cards, "position").map((card, index)=> ( <Card index={index} key={index}  id={""+index} value={card.value} prononciation={card.prononciation} say={props.say}/> )) }

                    {provided.placeholder}

                </div>
            )}
        </Droppable>
    )

})


export default Hand;
