import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { VolumeUpIcon } from '@heroicons/react/outline';


export default function Card(props) {

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
                <VolumeUpIcon className="h-4 w-4 text-gray-500 self-end"/>
                <div className="justify-self-center flex-grow grid mb-4 content-center">
                    <h3 className="select-none text-indigo-500 ">{props.card.value}</h3>
                </div>
            </div>
        )}
    </Draggable>
    );
  }
