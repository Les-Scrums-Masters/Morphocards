import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default class CardStatic extends React.Component{
    state={
        value: this.props.value
    }

    render (){
        return (
            <div
                    className="card"
                    >
                        <h3>{this.state.value}</h3>
                    </div>
            
        )
    }
}
