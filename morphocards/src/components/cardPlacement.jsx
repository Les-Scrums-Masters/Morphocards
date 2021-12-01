import React from 'react';
import Card from './card';
import { Droppable } from 'react-beautiful-dnd';

export default class CardPlacement extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      card: null
    };

  }

  updateCardLocal = (newCard) =>{
    this.setState({
      card:newCard
    });
  }

  getCardPlacement = () =>{
    if(this.state.card !== null){
      return this.state.card;
    }
    return null;
  }

  getValue = () =>{
    if(this.state.card !== null){
      return this.state.card.id;
    }
    return "";
  }

    render (){
        return (
            <Droppable droppableId={this.props.id}>
                {provided =>(
                    <div className="w-14 h-20 m-2 md:m-4 md:w-24 md:h-36 rounded-xl md:rounded-2xl bg-black bg-opacity-20 shadow-inner ring-4 ring-green-100 flex justify-center items-center"
                    ref={provided.innerRef}
                    {...provided.droppableProps}>

                    {this.state.card !== null ? <Card index={0} key={this.state.card.id}  id={""+this.state.card.id} value={this.state.card.value} /> : null }


                        {provided.placeholder}
                    </div>

                )}
            </Droppable>

        )
    }
}
