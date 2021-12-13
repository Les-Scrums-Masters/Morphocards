import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Card from './Card';
import { Droppable } from 'react-beautiful-dnd';

const CardPlacement = forwardRef((props, ref) => {


    const [cards, setCards] = useState([]);

    useImperativeHandle(ref, () => ({

      updateCards(newCards) {
        setCards(newCards);
      },

      getCards() {
        return cards;
      },

      getValue() {
        if(cards.length === 1){
          return cards[0].id;
        }
        return "";
      }

    }))

    const getStyle = isOver => {

      let base = "w-14 h-20 m-2 md:m-4 md:w-24 md:h-36 rounded-xl md:rounded-2xl bg-black shadow-inner ring-4 flex justify-center items-center transition ease-in-out duration-100 bg-opacity-20";

      let extension = isOver 
        ? " ring-green-500 bg-white"
        : " ring-green-100"

      return base + extension;

    }

    return (
      <Droppable droppableId={props.id}>
        {(provided, snapshot) =>(
          <div className={getStyle(snapshot.isDraggingOver)}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {cards.map((item) => (
              <Card index={0} key={item.uniqueId} card={item} say={props.say} />
            ))}
              {provided.placeholder}
          </div>
        )}
      </Droppable>
      );

});

export default CardPlacement
