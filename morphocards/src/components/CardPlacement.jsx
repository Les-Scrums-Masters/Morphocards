import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Card from './Card';
import { Droppable } from 'react-beautiful-dnd';

const CardPlacement = forwardRef((props, ref) => {


    const [card, setCard] = useState(null);

    useImperativeHandle(ref, () => ({

      updateCardLocal(newCard) {
        setCard(newCard);
      },

      getCard() {
        return card;
      },

      getValue() {
        if(card !== null){
          return card.prononciation;
        }
        return "";
      }

    }))

    return (
      <Droppable droppableId={props.id}>
        {provided =>(
          <div className="w-14 h-20 m-2 md:m-4 md:w-24 md:h-36 rounded-xl md:rounded-2xl bg-black bg-opacity-20 shadow-inner ring-4 ring-green-100 flex justify-center items-center"
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {card !== null ? <Card index={0} key={card.id}  id={""+card.id} card={card} say={props.say} /> : null }
              {provided.placeholder}
          </div>
        )}
      </Droppable>
      );

});

export default CardPlacement
