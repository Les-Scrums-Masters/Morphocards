import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Card from './Card';
import { Droppable } from 'react-beautiful-dnd';


/**
 * Main : la main du joueur qui comporte toutes les cartes
 *
 * @component Hand
 *
 * @param   {string} id  Id unique de la main (mot attendu + "/hand")
 * @param   {HandCardModel[]} cards  Liste des cartes de la main
 * @param   {function} say   Fonction pour faire parler la synthèse vocale
 * @param   {Ref} ref  Référence du composant
 *
 * @example
 * <Hand ref={handRef} id={handID} cards={props.round.handcards} say={props.say} />
 *
 * @return {JSX} Le rendu jsx de la main
 */


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
                <div className="flex h-24 md:h-40 justify-center items-center"
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
