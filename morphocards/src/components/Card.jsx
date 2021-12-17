import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { VolumeUpIcon } from '@heroicons/react/outline';


/**
 * Carte : la carte qui peut être glisser et déposer
 *
 * @component Card
 *
 * @param   {int} index  Numero de carte
 * @param   {string} key  Id unique de la carte (Mot du round + numero)
 * @param   {HandCardModel} card  Modèle de la carte qui contient toutes les données
 * @param   {function} say   Fonction pour faire parler la synthèse vocale
 *
 * @example
 * <Card index={index} key={item.uniqueId} card={item} say={props.say}/>
 *
 * @return {JSX} Le rendu jsx de la carte.
 */
function Card(props) {

    return (
        <Draggable
        draggableId={props.card.uniqueId}
        value={props.card.value}
        key={props.card.uniqueId}
        index={props.index}
    >
        {provided => (
            <div className="card shadow-md hover:shadow-xl transform hover:scale-110 filter active:drop-shadow-2xl active:scale-125"
            onClick={() => props.say(props.card.id)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
                <VolumeUpIcon className="h-3 w-3 text-gray-500 self-end md:h-6 md:w-6"/>
                <div className="justify-self-center flex-grow grid mb-4 content-center">
                    <h3 className="select-none text-indigo-500 text-xl md:text-3xl">{props.card.value}</h3>
                </div>
            </div>
        )}
    </Draggable>
    );
  }

export default Card;
