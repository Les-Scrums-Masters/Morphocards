import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useSpeechSynthesis } from 'react-speech-kit';


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
                <h3>{props.value}</h3>
            </div>
        )}
    </Draggable>
    );
  }