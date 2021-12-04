import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useSpeechSynthesis } from 'react-speech-kit';
import { VolumeUpIcon } from '@heroicons/react/outline';

export default function Card(props) {

    const { speak } = useSpeechSynthesis();
   
    return (
        <Draggable
        draggableId={props.id}
        index={props.index}
    >
        {provided => (
            <div className="card shadow-md hover:shadow-xl transform hover:scale-110 filter active:drop-shadow-2xl active:scale-125"
            onClick={() => speak({ 
                text: props.id, 
            })}
            ref={provided.innerRef}
            {...provided.draggableProps} 
            {...provided.dragHandleProps}
            >
                <VolumeUpIcon className="h-4 w-4 text-gray-500 self-end"/>
                <div className="justify-self-center flex-grow grid mb-4 content-center">
                    <h3 className="select-none text-indigo-500 ">{props.value}</h3>
                </div>
            </div>
        )}
    </Draggable>
    );
  }