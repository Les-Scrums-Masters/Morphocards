import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default class Card extends React.Component{
    state={
        value: this.props.value
    }

    handleClick = (e) =>{
        console.log(e.target);
        //SON A JOUER LORS DU CLICK
    }

    render (){
        return (
            <Draggable
                //key={this.props.id}
                draggableId={this.props.id}
                index={this.props.index}
            >
                {provided => (
                    <div
                    className="card"
                    onClick={this.handleClick}
                    ref={provided.innerRef}
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps}
                    >
                        <h3>{this.state.value}</h3>
                    </div>
                )}
            </Draggable>
            
        )
    }
}
